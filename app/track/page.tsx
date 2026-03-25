'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TrackingSearchPage() {
  const [orderId, setOrderId] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) {
      router.push(`/track/${orderId.trim()}`)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8 selection:bg-white selection:text-black">
      <div className="w-full max-w-lg">
        <div className="text-center mb-16">
          <Link href="/" className="text-4xl md:text-6xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity">
            Frame &amp; Focus
          </Link>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mt-4">Tracking Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Enter Your Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              className="bg-transparent border-b-2 border-gray-800 p-4 text-xl font-mono focus:border-white outline-none transition-colors text-center"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-black uppercase tracking-widest py-6 hover:bg-gray-200 transition-colors text-sm shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            Locate Shipment
          </button>
        </form>

        <div className="mt-16 text-center text-[10px] text-gray-700 font-bold uppercase tracking-widest leading-relaxed">
          Order ID is provided in your confirmation email.<br />
          Contact support@framefocus.com for assistance.
        </div>
      </div>
    </main>
  )
}
