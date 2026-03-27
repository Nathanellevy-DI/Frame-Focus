import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GlobalTrackPage({ searchParams }: { searchParams: Promise<{ email?: string, error?: string }> }) {
  const { email, error } = await searchParams
  let ordersList: any[] = []

  // If email was requested, fetch all orders bound to that email address
  if (email) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('id, created_at, status, total_amount, tracking_number, order_items(quantity, products(title))')
      .ilike('customer_email', email)
      .order('created_at', { ascending: false })
    
    if (data) ordersList = data
  }

  // The Omni-Search Server Action
  async function searchOrder(formData: FormData) {
    'use server'
    const query = (formData.get('orderId') as string)?.trim()
    if (!query) return

    // 1. Is it an email address?
    if (query.includes('@')) {
      redirect(`/track?email=${encodeURIComponent(query)}`)
    } else {
      // 2. It is an Order ID formatting. Securely strip any "ORD-" formatting.
      const supabase = await createClient()
      const searchId = query.toLowerCase().replace('ord-', '').trim()
      
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .ilike('id', `${searchId}%`)
        .limit(1)
        .single()
        
      if (order) {
        redirect(`/track/${order.id}`)
      } else {
        redirect(`/track?error=notfound`)
      }
    }
  }
  
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-24 flex flex-col items-center relative">
      <div className="absolute top-0 w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
            ← Back to Gallery
          </Link>
          <Link href="/" className="text-xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </Link>
        </div>
      </div>

      {email ? (
        // Rendering the complete Order History List View
        <div className="w-full max-w-4xl px-8 mt-40">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Order History</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
              Records for: {email}
            </p>
          </div>

          {ordersList.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">No orders found for this email address.</p>
              <Link href="/track" className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 hover:bg-gray-800 transition-colors">
                Try Another Search
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersList.map(order => (
                <Link key={order.id} href={`/track/${order.id}`} className="block border border-gray-200 p-6 md:p-8 hover:border-black transition-colors group shadow-sm hover:shadow-xl hover:-translate-y-1 transform duration-300 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-1">
                          {order.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-widest mb-1 truncate max-w-xs md:max-w-md">
                        {order.order_items?.[0]?.products?.title || 'Custom Print'}
                        {order.order_items?.length > 1 && ` + ${order.order_items.length - 1} more`}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Tracking ID: ORD-{order.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-8 border-t border-gray-100 md:border-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-black tracking-tighter">${parseFloat(String(order.total_amount)).toFixed(2)}</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Price</p>
                      </div>
                      <div className="text-gray-300 group-hover:text-black transition-colors text-xl font-black">
                        ➔
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="pt-16 text-center">
                <Link href="/track" className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  ← Search Again
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Rendering the Primary Search Field
        <div className="w-full max-w-xl px-8 text-center mt-auto mb-auto">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Track Your Order</h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-12 leading-relaxed">
            Enter your Email Address or specific Tracking ID.
          </p>
          
          <form action={searchOrder} className="flex flex-col gap-6">
            <input 
              name="orderId" 
              placeholder="e.g. nate@example.com or ORD-CC8188B0" 
              className={`w-full border-b-4 ${error === 'notfound' ? 'border-red-500' : 'border-black'} text-xl py-4 outline-none font-mono text-center focus:border-gray-500 transition-colors placeholder:text-gray-200`}
              required
              autoComplete="off"
              spellCheck="false"
            />
            {error === 'notfound' && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">Shipment Not Found. Please check your spelling.</p>
            )}
            <button 
              type="submit" 
              className="w-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] py-6 hover:bg-gray-800 transition-colors shadow-2xl mt-4"
            >
              Locate Order ➔
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
