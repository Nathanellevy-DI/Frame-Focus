'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteOrder(orderId: string) {
  try {
    const supabase = await createClient()
    
    // Deleting the order will automatically delete order_items due to CASCADE in schema.sql
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
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) throw error
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Order update error:", error)
    return { success: false, error: error.message }
  }
}
