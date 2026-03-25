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
  try {
    const supabase = await createClient()
    
    // 1. Update status
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('customer_email')
      .single()

    if (error) throw error
    
    // 2. Send email notification
    if (order?.customer_email && order.customer_email !== 'pending@checkout') {
      await sendOrderStatusEmail(order.customer_email, orderId, status)
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Order update error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  try {
    const supabase = await createClient()
    
    // 1. Update tracking
    const { data: order, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId)
      .select('customer_email')
      .single()

    if (error) throw error

    // 2. Send tracking email
    if (order?.customer_email && order.customer_email !== 'pending@checkout') {
      await sendOrderTrackingEmail(order.customer_email, orderId, trackingNumber)
    }
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Tracking update error:", error)
    return { success: false, error: error.message }
  }
}

