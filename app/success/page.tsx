import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center selection:bg-black selection:text-white">
      <div className="text-center max-w-lg px-8">
        <div className="text-6xl mb-8">✓</div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
          Order Confirmed
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your purchase. Your art prints are being prepared with care.
        </p>
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-12">
          A confirmation email will arrive shortly.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white font-black uppercase tracking-widest px-10 py-5 hover:bg-gray-900 transition-colors text-sm"
        >
          Return to Gallery
        </Link>
      </div>
    </main>
  )
}
