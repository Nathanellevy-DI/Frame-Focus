'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendOrderStatusEmail, sendOrderTrackingEmail } from '@/lib/email-service'

/**
 * Deletes an order from the database.
 */
export async function deleteOrder(orderId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    
    if (error) throw error
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Order deletion error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates an order status and triggers an automated email notification.
 */
export async function updateOrderStatus(orderId: string, status: string) {
  console.log(`🔄 Updating Order Status: ${orderId} -> ${status}`);
  try {
    const supabase = await createClient()
    
    // 1. Update status and get email
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('customer_email')
      .single()

    if (error) {
      console.error("❌ Supabase Update Error:", error);
      throw error;
    }
    
    console.log(`📧 Customer Email from DB: ${order?.customer_email}`);

    // 2. Send email notification if valid email exists
    if (order?.customer_email && order.customer_email !== 'pending@checkout' && order.customer_email.includes('@')) {
      console.log(`🚀 Triggering Email to: ${order.customer_email}`);
      await sendOrderStatusEmail(order.customer_email, orderId, status)
    } else {
      console.warn("⚠️ No valid customer email found. Skipping email.");
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("💥 Order update CRITICAL error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates an order's tracking number and triggers an automated shipping update email.
 */
export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  console.log(`🔄 Updating Tracking: ${orderId} -> ${trackingNumber}`);
  try {
    const supabase = await createClient()
    
    // 1. Update tracking
    const { data: order, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId)
      .select('customer_email')
      .single()

    if (error) {
      console.error("❌ Supabase Tracking Update Error:", error);
      throw error;
    }

    // 2. Send tracking email if valid email exists
    if (order?.customer_email && order.customer_email !== 'pending@checkout' && order.customer_email.includes('@')) {
      console.log(`🚀 Triggering Tracking Email to: ${order.customer_email}`);
      await sendOrderTrackingEmail(order.customer_email, orderId, trackingNumber)
    } else {
      console.warn("⚠️ No valid customer email found for tracking. Skipping email.");
    }
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("💥 Tracking update CRITICAL error:", error)
    return { success: false, error: error.message }
  }
}
