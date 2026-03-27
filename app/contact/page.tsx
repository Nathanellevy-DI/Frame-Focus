import Link from 'next/link'

export const metadata = {
  title: "Contact | Frame & Focus",
  description: "Get in touch for custom print orders, gallery curation, or assistance with your recent purchase."
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-black selection:bg-black selection:text-white pb-32">
      {/* Refined Navigation Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
            ← Back to Gallery
          </Link>
          <Link href="/" className="text-xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-24">
        {/* Header Block */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Whether you are looking for a completely custom print size, curation advice for your gallery wall, or simply need assistance with an existing order, we are here to help.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Custom Orders Card */}
          <div className="bg-white p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 transform transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
            <div className="text-3xl mb-6">✨</div>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Custom Commissions</h2>
            <p className="text-sm text-gray-500 leading-loose mb-8">
              Spotted a photograph on our Instagram that isn't in the store? Or perhaps you need a massive 40x60" showpiece for a corporate lobby? Tell us your vision and we will make it a reality.
            </p>
            <a href="mailto:Framesfocusprints@mail.ru?subject=Custom Print Inquiry" className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 hover:bg-gray-800 transition-colors w-full text-center">
              Request Custom Quote
            </a>
          </div>

          {/* Order Support Card */}
          <div className="bg-white p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 transform transition-all hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
            <div className="text-3xl mb-6">📦</div>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Order Support</h2>
            <p className="text-sm text-gray-500 leading-loose mb-8">
              Having trouble tracking your package? Need to update your shipping address before the warehouse dispatches your print? Our fulfillment team is available to assist you.
            </p>
            <a href="mailto:Framesfocusprints@mail.ru?subject=Order Support Request" className="inline-block border-2 border-black text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 hover:bg-black hover:text-white transition-colors w-full text-center">
              Contact Support Team
            </a>
          </div>

        </div>

        {/* Direct Email Fallback */}
        <div className="mt-20 text-center border-t border-gray-200 pt-16">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Direct Communication Line</p>
          <a href="mailto:Framesfocusprints@mail.ru" className="text-2xl font-bold tracking-tight hover:underline decoration-2 underline-offset-8">
            Framesfocusprints@mail.ru
          </a>
        </div>

      </div>
    </main>
  )
}
