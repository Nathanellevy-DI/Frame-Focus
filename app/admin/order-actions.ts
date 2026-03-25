'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { sendOrderStatusEmail, sendOrderTrackingEmail } from '@/lib/email-service'

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

    // 2. Send email notification
    if (order?.customer_email && order.customer_email !== 'pending@checkout') {
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

    // 2. Send tracking email
    if (order?.customer_email && order.customer_email !== 'pending@checkout') {
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

