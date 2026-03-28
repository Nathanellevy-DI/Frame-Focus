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
    
    // Only update images if new ones were explicitly provided
    const imageUrl = formData.get('imageUrl') as string
    if (imageUrl && imageUrl.length > 0) {
      updateData.image_urls = imageUrl.split(',')
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

export async function toggleProductAvailability(productId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_available: !currentStatus })
      .eq('id', productId)
      
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Toggle availability error:", error)
    return { success: false, error: error.message }
  }
}

export async function addProductImage(productId: string, imageUrl: string) {
  try {
    const supabase = await createClient()

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_urls')
      .eq('id', productId)
      .single()

    if (fetchError) throw fetchError

    const currentUrls = Array.isArray(product.image_urls) ? product.image_urls : []
    const updatedUrls = [...currentUrls, imageUrl]

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_urls: updatedUrls })
      .eq('id', productId)

    if (updateError) throw updateError

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error("Add image error:", error)
    return { success: false, error: error.message }
  }
}

export async function removeProductImage(productId: string, imageUrlToRemove: string) {
  try {
    const supabase = await createClient()
    
    // First fetch current arrays
    const { data: product } = await supabase.from('products').select('image_urls').eq('id', productId).single()
    if (!product) throw new Error("Product not found")

    const currentImages = product.image_urls || []
    const newImages = currentImages.filter((img: string) => img !== imageUrlToRemove)

    // Ensure we don't delete the last image!
    if (newImages.length === 0) {
      throw new Error("Cannot delete the only image. Please upload a new image first before deleting this one.")
    }

    const { error } = await supabase
      .from('products')
      .update({ image_urls: newImages })
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath(`/product/${productId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Remove image error:", error)
    return { success: false, error: error.message }
  }
}
