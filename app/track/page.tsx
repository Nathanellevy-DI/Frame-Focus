import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function GlobalTrackPage() {
  async function searchOrder(formData: FormData) {
    'use server'
    const id = formData.get('orderId') as string
    if (!id || id.trim() === '') return
    redirect(`/track/${id.trim()}`)
  }
  
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-24 flex flex-col items-center justify-center relative">
      <div className="absolute top-0 w-full border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-sm font-black uppercase tracking-widest hover:underline">
            ← Back to Gallery
          </Link>
          <span className="text-2xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </span>
        </div>
      </div>

      <div className="w-full max-w-xl px-8 text-center mt-32">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Track Your Order</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-12 leading-relaxed">
          Enter your unique Tracking ID to locate your shipment.
        </p>
        
        <form action={searchOrder} className="flex flex-col gap-8">
          <input 
            name="orderId" 
            placeholder="e.g. cc8188b0-675f..." 
            className="w-full border-b-4 border-black text-xl py-4 outline-none font-mono text-center focus:border-gray-500 transition-colors placeholder:text-gray-200"
            required
            autoComplete="off"
            spellCheck="false"
          />
          <button 
            type="submit" 
            className="w-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] py-6 hover:bg-gray-800 transition-colors shadow-2xl"
          >
            Locate Shipment ➔
          </button>
        </form>
      </div>
    </main>
  )
}
