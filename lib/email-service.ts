import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderStatusEmail(email: string, orderId: string, status: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping email.")
    return
  }

  const statusMessages: Record<string, string> = {
    'paid': 'Your payment has been confirmed. We are starting to process your art prints!',
    'ordered': 'Great news! Your prints have been ordered from our premium lab (VistaPrint).',
    'shipped': 'Your luxury prints are on the way! Check your tracking number for details.',
    'delivered': 'Your prints have arrived. We hope they bring a new focus to your space!',
    'cancelled': 'Your order has been cancelled. If this was a mistake, please contact us.'
  }

  const message = statusMessages[status] || `Your order status has been updated to: ${status}`

  try {
    await resend.emails.send({
      from: 'Orders <orders@framefocus.com>',
      to: email,
      subject: `Update on Order ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px;">
          <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Frame & Focus</h1>
          <p style="font-size: 14px; text-transform: uppercase; color: #666; letter-spacing: 2px;">Order Update</p>
          <div style="margin: 40px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
            <p style="font-size: 18px; font-weight: bold;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #999;">Order ID: ${orderId}</p>
          <hr style="margin: 40px 0;" />
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track/${orderId}" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            Track Your Order
          </a>
        </div>
      `
    })
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}

export async function sendOrderTrackingEmail(email: string, orderId: string, trackingNumber: string) {
  if (!process.env.RESEND_API_KEY) return

  try {
    await resend.emails.send({
      from: 'Orders <orders@framefocus.com>',
      to: email,
      subject: `Tracking Added: Order ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px;">
          <h1 style="text-transform: uppercase; letter-spacing: -1px; font-weight: 900;">Frame & Focus</h1>
          <p style="font-size: 14px; text-transform: uppercase; color: #666; letter-spacing: 2px;">Shipping Update</p>
          <div style="margin: 40px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
            <p style="font-size: 18px; font-weight: bold;">Your order has a new tracking number:</p>
            <p style="font-size: 24px; font-weight: 900; letter-spacing: -1px; margin: 10px 0;">${trackingNumber}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track/${orderId}" style="display: inline-block; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            View Detailed Status
          </a>
        </div>
      `
    })
  } catch (error) {
    console.error("Failed to send tracking email:", error)
  }
}
