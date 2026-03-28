'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from './CartProvider'

export default function StorefrontGrid({ products, categories = [] }: { products: any[], categories?: any[] }) {
  const { addItem } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const newArrivals = products.slice(0, 3)
  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category_id === activeCategory)

  // Filter out internal backend categories from the public nav bar
  const displayCategories = categories.filter(c => c.name !== 'Uncategorized' && c.name !== 'Printful Auto-Sync')

  const ProductCard = ({ product }: { product: any }) => (
    <article className="group relative break-inside-avoid mb-12 border-b-2 border-black pb-8">
      <Link href={`/product/${product.id}`}>
        <div className="w-full aspect-[3/4] bg-gray-100 mb-8 overflow-hidden relative shadow-2xl cursor-pointer">
          <img
            src={product.image_urls?.[0] || ''}
            alt={product.title}
            className="w-full h-full object-cover grayscale contrast-[1.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        </div>
      </Link>
      <div className="flex justify-between items-start">
        <Link href={`/product/${product.id}`} className="pr-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 hover:underline">{product.title}</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {product.description || categories.find(c => c.id === product.category_id)?.name || 'Fine Art Print'}
          </p>
        </Link>
        <p className="text-xl font-black shrink-0 tracking-tighter">${parseFloat(String(product.price)).toFixed(2)}</p>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 bg-white text-black hover:bg-gray-100 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-xs text-center flex items-center justify-center"
        >
          Select Size
        </Link>
        <Link
          href={`/product/${product.id}`}
          className="flex-1 bg-black text-white hover:bg-gray-900 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-xs text-center flex items-center justify-center"
        >
          View Details
        </Link>
      </div>
    </article>
  )

  return (
    <div>
      {/* Category Navigation Bar & Utility Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16 border-b border-black/10 pb-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-sm ${
              activeCategory === 'ALL' 
                ? 'bg-black text-white scale-105' 
                : 'bg-white text-gray-500 border border-black hover:text-black hover:bg-gray-100'
            }`}
          >
            All Prints
          </button>
          {displayCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-sm ${
                activeCategory === cat.id 
                  ? 'bg-black text-white scale-105' 
                  : 'bg-white text-gray-500 border border-black hover:text-black hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Aligned Utility Links */}
        <nav className="flex items-center gap-4 shrink-0">
          <Link 
            href="/track" 
            className="text-xs font-black uppercase tracking-widest bg-white text-black border-2 border-black px-6 py-3 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Track Order
          </Link>
          <Link 
            href="/contact" 
            className="text-xs font-black uppercase tracking-widest bg-black text-white border-2 border-black px-6 py-3 hover:bg-gray-800 transition-colors shadow-sm"
          >
            Contact Us
          </Link>
        </nav>
      </div>

      {/* New Arrivals Section */}
      {activeCategory === 'ALL' && newArrivals.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">New Arrivals</h2>
            <div className="h-[2px] bg-black flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Main Gallery */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-300 flex-shrink-0">
          {activeCategory === 'ALL' ? 'Complete Collection' : categories.find(c => c.id === activeCategory)?.name}
        </h2>
        <div className="h-[2px] bg-gray-200 flex-grow"></div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300">
          <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
