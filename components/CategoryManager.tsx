'use client'

import { useState } from 'react'
import { createCategory, deleteCategory } from '@/app/admin/category-actions'

interface Category {
  id: string
  name: string
  created_at: string
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [newCat, setNewCat] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newCat.trim() || loading) return
    setLoading(true)
    const res = await createCategory(newCat.trim())
    if (!res.success) alert(res.error)
    else setNewCat('')
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    if (name === 'Uncategorized' || name === 'Fine Art Print') {
      alert("Cannot delete system default categories.")
      return
    }
    if (!confirm(`Are you sure you want to delete the category "${name}"? Artworks inside it will become Uncategorized.`)) return
    
    setLoading(true)
    const res = await deleteCategory(id)
    if (!res.success) alert(res.error)
    setLoading(false)
  }

  return (
    <div className="border border-gray-800 p-6 opacity-90 hover:opacity-100 transition-opacity">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Manage Categories</h3>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-6">
        <input 
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New Category (e.g. New York)"
          className="flex-1 bg-black border border-gray-800 p-3 text-sm focus:outline-none focus:border-white transition-colors"
          maxLength={50}
        />
        <button 
          disabled={loading || !newCat.trim()}
          type="submit"
          className="bg-white text-black font-black uppercase tracking-widest px-6 text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {categories.map(c => (
          <div key={c.id} className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2">
            <span className="text-xs uppercase tracking-widest font-bold">{c.name}</span>
            {c.name !== 'Uncategorized' && c.name !== 'Fine Art Print' && (
              <button 
                onClick={() => handleDelete(c.id, c.name)}
                disabled={loading}
                className="text-gray-500 hover:text-red-500 transition-colors ml-2"
                title="Delete Category"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
