import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import sql from '@/lib/db'



export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      apiVersion: '2026-02-25.clover' // Match installed stripe types
    })

    const { productId } = await req.json()

    // 1. Fetch product from PostgreSQL
    const products = await sql`SELECT * FROM products WHERE id = ${productId} LIMIT 1`
    const product = products[0]

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description || 'Fine Art Print',
              images: [product.image_url],
            },
            unit_amount: Math.round(parseFloat(product.price) * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`,
    })

    // 3. Create a pending order in the database
    if (session.id) {
      await sql`
        INSERT INTO orders (customer_email, stripe_session_id, total_amount, status)
        VALUES ('pending@checkout', ${session.id}, ${product.price}, 'pending')
      `
      // Optionally link it in order_items but omitting for brevity until successful
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
