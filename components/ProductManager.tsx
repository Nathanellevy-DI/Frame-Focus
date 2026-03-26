'use client'

import { useState } from 'react'
import { deleteProduct, updateProduct, toggleProductAvailability } from '@/app/admin/product-actions'
import VariantManager from './VariantManager'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string
  is_available: boolean
  created_at: string
  product_variants?: any[]
}

export default function ProductManager({ products }: { products: Product[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  async function handleSyncPrintful() {
    setSyncing(true)
    try {
      const res = await fetch('/api/printful/sync', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        window.location.reload() // Refresh to see synced catalog
      } else alert(`Sync Error: ${data.error}`)
    } catch (err: any) {
      alert(`Sync Failed: ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to remove this product from the gallery?')) return
    setDeleting(productId)
    const result = await deleteProduct(productId)
    if (!result.success) {
      alert(`Failed to delete: ${result.error}`)
    }
    setDeleting(null)
  }

  async function handleToggle(productId: string, currentState: boolean) {
    await toggleProductAvailability(productId, !currentState)
  }

  async function handleSaveEdit(productId: string, formData: FormData) {
    const result = await updateProduct(productId, formData)
    if (result.success) {
      setEditingId(null)
    } else {
      alert(`Failed to update: ${result.error}`)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 p-8 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest">No products in catalog</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-white pl-4 text-white">
          Catalog Inventory ({products.length})
        </h2>
        <button
          onClick={handleSyncPrintful}
          disabled={syncing}
          className="text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white px-4 py-2 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {syncing ? (
            <span className="animate-spin w-4 h-4 rounded-full border-t-2 border-white block"></span>
          ) : (
            '⚡ Auto-Sync from Printful'
          )}
        </button>
      </div>

      {products.map((product) => (
        <div key={product.id} className="border border-gray-800 p-4 group hover:border-gray-600 transition-colors">
          {editingId === product.id ? (
            // Edit Mode
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleSaveEdit(product.id, formData)
              }}
              className="space-y-3"
            >
              <input
                name="title"
                defaultValue={product.title}
                className="w-full bg-transparent border-b border-gray-600 text-white p-2 outline-none focus:border-white text-sm font-bold"
                placeholder="Title"
              />
              <input
                name="description"
                defaultValue={product.description || ''}
                className="w-full bg-transparent border-b border-gray-600 text-white p-2 outline-none focus:border-white text-sm"
                placeholder="Description"
              />
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                className="w-full bg-transparent border-b border-gray-600 text-white p-2 outline-none focus:border-white text-sm"
                placeholder="Price"
              />
              <input type="hidden" name="imageUrl" value="" />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-2 hover:bg-gray-200 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 border border-gray-600 text-gray-400 text-xs font-bold uppercase tracking-widest py-2 hover:border-white hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="flex gap-4 items-start">
              <div className="w-16 h-20 bg-gray-900 flex-shrink-0 overflow-hidden border border-gray-800">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white truncate uppercase tracking-tight">
                    {product.title}
                  </h3>
                  {!product.is_available && (
                    <span className="text-[9px] bg-red-900 text-red-300 px-2 py-0.5 uppercase tracking-widest font-bold">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-bold tracking-tight">
                  ${parseFloat(String(product.price)).toFixed(2)}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditingId(product.id)}
                    className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggle(product.id, product.is_available)}
                    className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors font-bold"
                  >
                    {product.is_available ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors font-bold disabled:opacity-50"
                  >
                    {deleting === product.id ? 'Removing...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Variant Manager shows below the artwork details if not in edit mode */}
          {editingId !== product.id && (
            <VariantManager 
              productId={product.id} 
              variants={product.product_variants || []} 
            />
          )}

        </div>
      ))}
    </div>
  )
}
