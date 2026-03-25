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

    const { items } = await req.json()

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
      await supabase.from('orders').insert({
        customer_email: 'pending@checkout',
        stripe_session_id: paymentLink.id, // Re-using column for Square ID
        total_amount: totalAmount,
        status: 'pending'
      })
    }

    return NextResponse.json({ url: paymentLink?.url })
  } catch (error: any) {
    console.error('Square checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
