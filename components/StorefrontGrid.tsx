'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export default function StorefrontGrid({ products }: { products: any[] }) {
  const { addItem } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
      {products.map((product: any) => (
        <article key={product.id} className="group relative break-inside-avoid mb-12 border-b-2 border-black pb-8">
          <Link href={`/product/${product.id}`}>
            <div className="w-full aspect-[3/4] bg-gray-100 mb-8 overflow-hidden relative shadow-2xl cursor-pointer">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover grayscale contrast-[1.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </div>
          </Link>
          <div className="flex justify-between items-start">
            <Link href={`/product/${product.id}`} className="pr-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 hover:underline">{product.title}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.description || product.category || 'Print'}</p>
            </Link>
            <p className="text-xl font-black shrink-0 tracking-tighter">${parseFloat(String(product.price)).toFixed(2)}</p>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image_url: product.image_url,
              })}
              className="flex-1 bg-white text-black hover:bg-gray-100 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-xs"
            >
              Add to Bag
            </button>
            <Link
              href={`/product/${product.id}`}
              className="flex-1 bg-black text-white hover:bg-gray-900 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-xs text-center"
            >
              View Details
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
