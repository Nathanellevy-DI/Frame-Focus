'use client'

import { useCart } from './CartProvider'
import Link from 'next/link'

export default function CartButton() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/cart"
      className="fixed top-6 right-6 z-50 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-3 px-5 py-3 shadow-xl"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      <span className="text-xs font-black uppercase tracking-widest">Bag</span>
      {totalItems > 0 && (
        <span className="bg-white text-black w-6 h-6 flex items-center justify-center text-xs font-black">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
