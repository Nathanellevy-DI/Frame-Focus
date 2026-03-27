'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) {
      if (error.code === '23503') {
        return { 
          success: false, 
          error: "Cannot delete this product because it has already been ordered by customers. Please use the 'Hide' button instead to preserve your historical order records." 
        }
      }
      throw error
    }
    
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Product deletion error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const category_id = formData.get('category_id') as string

  try {
    const supabase = await createClient()
    
    const updateData: any = { title, description, price }
    if (category_id) updateData.category_id = category_id
    
    // Only update image if a new one was provided
    if (imageUrl && imageUrl.length > 0) {
      updateData.image_url = imageUrl
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Product update error:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleProductAvailability(productId: string, isAvailable: boolean) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_available: isAvailable })
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error("Toggle availability error:", error)
    return { success: false, error: error.message }
  }
}
