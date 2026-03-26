'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartProvider'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { clearCart } = useCart()
  const [status, setStatus] = useState('Confirming payment with Square...')

  useEffect(() => {
    // 1. Clear customer's browser shopping cart
    clearCart()

    if (!orderId) {
      setStatus('Order confirmed.')
      return
    }

    // 2. Trigger the invisible Printful Dispatch Webhook
    fetch('/api/printful/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.dispatched) {
        setStatus('Payment verified. Printful production has automatically started! 🚀')
      } else if (data.success) {
        setStatus('Payment verified. Our team is manually preparing your order.')
      } else {
        setStatus('Order saved. Pending payment verification.')
      }
    })
    .catch(() => setStatus('Order confirmed. Check your email for details.'))

  }, [orderId, clearCart])

  return (
    <div className="text-center max-w-lg px-8">
      <div className="text-6xl mb-8">✓</div>
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
        Order Confirmed
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        Thank you for your purchase. Your art prints are being prepared with care.
      </p>
      <div className="bg-gray-50 border border-gray-200 p-4 mb-12">
        <p className="text-xs text-gray-800 uppercase tracking-widest font-bold">
          {status}
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-black text-white font-black uppercase tracking-widest px-10 py-5 hover:bg-gray-900 transition-colors text-sm"
      >
        Return to Gallery
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center selection:bg-black selection:text-white">
      <Suspense fallback={<div className="text-xs uppercase tracking-widest text-gray-400">Loading Order Data...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
