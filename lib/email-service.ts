import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sender address — change this after verifying your own domain in Resend
const FROM_ADDRESS = 'Frame & Focus <onboarding@resend.dev>'

/**
 * Branded email wrapper for consistent styling across all emails.
 */
function emailLayout(content: string, orderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #000; color: #fff; padding: 30px 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Frame & Focus</h1>
        <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999;">Luxury Art Prints</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #000; padding: 30px 40px; text-align: center;">
        <a href="${siteUrl}/track/${orderId}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          Track Your Order
        </a>
        <p style="margin: 20px 0 0; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
          Order ID: ORD-${orderId.split('-')[0].toUpperCase()}
        </p>
      </div>
    </div>
  `
}

/**
 * Sent immediately when a customer places an order.
 */
export async function sendOrderReceivedEmail(email: string, orderId: string, customerName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set. Skipping order received email.")
    return
  }

  const content = `
    <h2 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 20px;">Thank You for Your Order!</h2>
    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      Hi ${customerName || 'there'},
    </p>
    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      We've received your order and our team is reviewing it now. You'll receive updates at each step of the process — from confirmation through to delivery.
    </p>
    <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
      <p style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; margin: 0;">Current Status</p>
      <p style="font-size: 20px; font-weight: 900; margin: 8px 0 0;">Order Received ✓</p>
    </div>
    <p style="font-size: 13px; color: #999;">We'll notify you as soon as your order is confirmed and being prepared.</p>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: 'Framesfocusprints@mail.ru',
      subject: `Order Received — ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: emailLayout(content, orderId)
    })

    if (error) {
      console.error("❌ Resend Error (Order Received):", JSON.stringify(error))
    } else {
      console.log(`✅ Order Received email sent to ${email}: ${data?.id}`)
    }
  } catch (err) {
    console.error("💥 Failed to send Order Received email:", err)
  }
}

/**
 * Sent when admin changes the order status.
 */
export async function sendOrderStatusEmail(email: string, orderId: string, status: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set. Skipping status email.")
    return
  }

  const statusConfig: Record<string, { title: string; message: string; emoji: string }> = {
    'paid': {
      title: 'Payment Confirmed',
      message: 'Your payment has been verified. We are now preparing your art prints with care.',
      emoji: '💳'
    },
    'ordered': {
      title: 'Prints Being Produced',
      message: 'Great news! Your prints have been sent to our premium production lab. This typically takes 2-5 business days.',
      emoji: '🎨'
    },
    'shipped': {
      title: 'Order Shipped!',
      message: 'Your luxury prints are on their way! Check the tracking link below for delivery updates.',
      emoji: '📦'
    },
    'delivered': {
      title: 'Order Delivered',
      message: 'Your prints have arrived! We hope they bring a new dimension to your space. Thank you for choosing Frame & Focus.',
      emoji: '🏠'
    },
    'cancelled': {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If this was a mistake or you have questions, please reach out to us.',
      emoji: '❌'
    }
  }

  const config = statusConfig[status] || {
    title: `Status: ${status}`,
    message: `Your order status has been updated to: ${status}.`,
    emoji: '📋'
  }

  const content = `
    <h2 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 20px;">${config.emoji} ${config.title}</h2>
    <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
      <p style="font-size: 16px; font-weight: 500; color: #333; line-height: 1.6; margin: 0;">${config.message}</p>
    </div>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: 'Framesfocusprints@mail.ru',
      subject: `${config.title} — ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: emailLayout(content, orderId)
    })

    if (error) {
      console.error("❌ Resend Error (Status):", JSON.stringify(error))
    } else {
      console.log(`✅ Status email (${status}) sent to ${email}: ${data?.id}`)
    }
  } catch (err) {
    console.error("💥 Failed to send status email:", err)
  }
}

/**
 * Sent when admin adds a tracking number.
 */
export async function sendOrderTrackingEmail(email: string, orderId: string, trackingNumber: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set. Skipping tracking email.")
    return
  }

  const content = `
    <h2 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 20px;">📦 Your Tracking Number</h2>
    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      Your order has been shipped! Here is your tracking number:
    </p>
    <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000; text-align: center;">
      <p style="font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0; font-family: monospace;">${trackingNumber}</p>
    </div>
    <p style="font-size: 13px; color: #999;">Use the button below to view the full status of your delivery.</p>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: 'Framesfocusprints@mail.ru',
      subject: `Tracking Added — ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: emailLayout(content, orderId)
    })

    if (error) {
      console.error("❌ Resend Error (Tracking):", JSON.stringify(error))
    } else {
      console.log(`✅ Tracking email sent to ${email}: ${data?.id}`)
    }
  } catch (err) {
    console.error("💥 Failed to send tracking email:", err)
  }
}
