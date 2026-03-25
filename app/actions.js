'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const price = parseFloat(formData.get('price'))
  const imageUrl = formData.get('imageUrl')

  try {
    await sql`
      INSERT INTO products (title, description, price, image_url)
      VALUES (${title}, ${description}, ${price}, ${imageUrl})
    `
    // This clears the cache so the new product shows up on the shop page instantly
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: "Failed to add product" }
  }
}
