'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart()
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })

  async function handleCheckout() {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email for delivery updates.')
      return
    }

    if (!shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      alert('Please complete all shipping information fields.')
      return
    }

    try {
      const res = await fetch('/api/checkout-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          email,
          shippingData: shipping
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout failed:', err)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header */}
      <div className="border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm font-black uppercase tracking-widest hover:underline">
            ← Continue Shopping
          </Link>
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black pb-6">
          Your Bag
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border-2 border-black">
            <p className="text-2xl font-black uppercase tracking-widest mb-4">Your bag is empty</p>
            <p className="text-gray-500 mb-8">Discover our curated collection of fine art prints.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-900 transition-colors text-sm"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-0">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-8 border-b border-gray-200">
                  {/* Thumbnail */}
                  <div className="w-28 h-36 bg-gray-100 overflow-hidden shrink-0 shadow-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter">{item.title}</h3>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">Fine Art Print</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-10 h-10 flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-sm font-black border-x-2 border-black">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-10 h-10 flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black tracking-tighter">
                      ${(parseFloat(String(item.price)) * item.qty).toFixed(2)}
                    </p>
                    {item.qty > 1 && (
                      <p className="text-xs text-gray-400 mt-1">
                        ${parseFloat(String(item.price)).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-12 flex flex-col items-end">
              <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500">Subtotal</span>
                  <span className="text-xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500">Shipping</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-green-600">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-2 pb-6 border-b-2 border-black">
                  <span className="text-sm font-black uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping Info Section */}
                <div className="mt-12 space-y-6 pt-12 border-t-4 border-black">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        placeholder="E.g. Alexander Hamilton"
                        value={shipping.name}
                        onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Gallery Row, Apt 4B"
                        value={shipping.address}
                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">City</label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">State/PR</label>
                        <input
                          type="text"
                          placeholder="NY"
                          value={shipping.state}
                          onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Zip Code</label>
                        <input
                          type="text"
                          placeholder="10001"
                          value={shipping.zip}
                          onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 shadow-sm">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Phone Number (For Carrier Updates)</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email for Delivery Notifications</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-bold outline-none focus:border-black transition-colors text-black"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    !email || 
                    !email.includes('@') || 
                    !shipping.name || 
                    !shipping.address || 
                    !shipping.city || 
                    !shipping.state || 
                    !shipping.zip ||
                    items.length === 0
                  }
                  className="w-full bg-black text-white font-black uppercase tracking-widest py-5 hover:bg-gray-900 transition-colors text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {items.length === 0 ? 'Bag is Empty' : 'Proceed to Checkout'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors py-2 text-center"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
