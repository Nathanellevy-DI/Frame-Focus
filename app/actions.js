'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const price = parseFloat(formData.get('price'))
  const imageUrl = formData.get('imageUrl')

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').insert({
      title,
      description,
      price,
      image_url: imageUrl
    })

    if (error) throw error

    // This clears the cache so the new product shows up instantly
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}
