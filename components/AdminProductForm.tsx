'use client'

import { addProduct } from '@/app/actions'
import { useRef, useState, ChangeEvent, DragEvent } from 'react'

export default function AdminProductForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false)

  async function handleFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith('image/')) return

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview((e.target?.result as string) || null)
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  function handleDrag(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  return (
    <div className="bg-black p-8 border border-white max-w-lg mx-auto mt-10">
      <h2 className="text-white text-2xl font-bold mb-6 tracking-tighter uppercase">
        Add New Art Print
      </h2>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          formData.set('imageUrl', imageUrl)
          await addProduct(formData)
          formRef.current?.reset()
          setPreview(null)
          setImageUrl('')
        }} 
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Title</label>
          <input 
            name="title" 
            className="bg-transparent border-b border-white text-white p-2 outline-none focus:border-gray-500 transition-colors"
            placeholder="E.g. Midnight in Tel Aviv"
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Description</label>
          <input 
            name="description" 
            className="bg-transparent border-b border-white text-white p-2 outline-none focus:border-gray-500 transition-colors"
            placeholder="E.g. A beautiful night scene."
          />
        </div>

        {/* Image Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Artwork Image</label>
          <div
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed cursor-pointer transition-all duration-300 min-h-[200px] flex items-center justify-center relative overflow-hidden ${
              dragActive 
                ? 'border-white bg-white/10' 
                : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
            />

            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Preview" className="w-full h-auto object-contain max-h-[300px]" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-white text-xs uppercase tracking-widest animate-pulse">
                      Optimizing...
                    </div>
                  </div>
                )}
                {!uploading && imageUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-center py-2">
                    <span className="text-green-400 text-xs uppercase tracking-widest">✓ Ready</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-gray-500 text-3xl mb-3">↑</div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  Drop image here or click to browse
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  Any format · Any size · Auto-optimized
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden field for the uploaded URL */}
        <input type="hidden" name="imageUrl" value={imageUrl} />

        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Price ($)</label>
          <input 
            name="price" 
            type="number"
            step="0.01"
            className="bg-transparent border-b border-white text-white p-2 outline-none"
            placeholder="250.00"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={!imageUrl || uploading}
          className={`font-bold py-4 mt-4 transition-all uppercase text-sm tracking-widest ${
            !imageUrl || uploading
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {uploading ? 'Processing Image...' : 'Publish to Gallery'}
        </button>
      </form>
    </div>
  )
}
