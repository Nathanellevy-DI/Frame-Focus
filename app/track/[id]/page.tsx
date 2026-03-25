import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TrackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch order with items and product details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        products (
          title,
          image_url
        )
      )
    `)
    .eq('id', id)
    .single()

  if (!order) return notFound()

  const statusSteps = [
    { id: 'pending', label: 'Order Received', icon: '📥' },
    { id: 'paid', label: 'Payment Confirmed', icon: '💳' },
    { id: 'ordered', label: 'Processing at Print Lab', icon: '🎨' },
    { id: 'shipped', label: 'Dispatched', icon: '📦' },
    { id: 'delivered', label: 'Delivered', icon: '🏠' },
  ]

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status)

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-24">
      {/* Header */}
      <div className="border-b-2 border-black sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1">
            Status: {order.status}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-20">
        <div className="mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Track Order</h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            ID: {order.id.toUpperCase()} • {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-20">
          <div className="relative flex justify-between">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
            
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex
              const isCurrent = idx === currentStepIndex

              return (
                <div key={step.id} className="flex flex-col items-center gap-3 w-20 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                    isCompleted ? 'bg-black text-white shadow-xl' : 'bg-white border-2 border-gray-100 text-gray-200'
                  } ${isCurrent ? 'ring-4 ring-gray-100 scale-110' : ''}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest leading-tight ${
                    isCompleted ? 'text-black' : 'text-gray-300'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Tracking Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Delivery Information</h2>
              {order.tracking_number ? (
                <div className="bg-gray-50 p-8 border-l-4 border-black">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Carrier Tracking</p>
                  <p className="text-2xl font-black tracking-tighter mb-4">{order.tracking_number}</p>
                  <a 
                    href={`https://www.google.com/search?q=${order.tracking_number}`} 
                    target="_blank" 
                    className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
                  >
                    Track Package →
                  </a>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-100 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    Tracking will be available once shipped
                  </p>
                </div>
              )}
            </div>

            {order.shipping_address && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Destination</h2>
                <p className="text-sm font-bold uppercase tracking-tight leading-relaxed text-gray-600">
                  {order.customer_name}<br />
                  {order.shipping_address}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Order Summary</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center py-4 border-b border-gray-100 last:border-0">
                  <div className="w-12 h-16 bg-gray-50 flex-shrink-0">
                    <img src={item.products?.image_url} alt="" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">{item.products?.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">QTY: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="pt-6">
                <p className="text-3xl font-black tracking-tighter">
                  Total: ${parseFloat(String(order.total_amount)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 italic">
            Thank you for choosing Frame & Focus Quality
          </p>
          <Link href="/" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            Return to Gallery
          </Link>
        </div>
      </div>
    </main>
  )
}
