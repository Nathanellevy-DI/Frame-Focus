import { NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment: SquareEnvironment.Production,
    })

    const { items, email } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    const idempotencyKey = crypto.randomUUID()

    // Build Square order line items
    const lineItems = items.map((item: any) => ({
      name: item.title,
      quantity: String(item.qty),
      basePriceMoney: {
        amount: BigInt(Math.round(parseFloat(String(item.price)) * 100)),
        currency: 'USD',
      },
    }))

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + parseFloat(String(i.price)) * i.qty, 0
    )

    // Create Square Checkout link
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey,
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/success`,
        askForShippingAddress: true,
      },
    })

    const paymentLink = response.paymentLink

    // Record pending order in DB
    if (paymentLink?.id) {
      const supabase = await createClient()
      
      // 1. Create the main order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: email || 'pending@checkout',
          stripe_session_id: paymentLink.id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create the itemized records
      const itemRecords = items.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.qty,
        price_at_purchase: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemRecords)

      if (itemsError) throw itemsError
    }

    return NextResponse.json({ url: paymentLink?.url })
  } catch (error: any) {
    console.error('Square checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
