import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import StorefrontGrid from '@/components/StorefrontGrid'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const supabase = await createClient()
    
    const { data: catData } = await supabase.from('categories').select('*').order('name')
    if (catData) categories = catData

    const { data: pData, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    if (pData) products = pData
  } catch (err) {
    console.error("Database error:", err);
  }

  return (
    <main className="min-h-screen bg-white text-black p-8 md:p-16 selection:bg-black selection:text-white">
      <header className="mb-20 border-b-8 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">Prints</p>
        </div>
        <nav className="flex items-center gap-6">
          <Link 
            href="/contact" 
            className="text-xs font-black uppercase tracking-widest bg-black text-white px-6 py-4 hover:bg-gray-800 transition-colors shadow-xl"
          >
            Custom Inquiries & Contact
          </Link>
        </nav>
      </header>
      
      {products.length === 0 ? (
        <div className="text-center py-32 border-4 border-black bg-gray-50">
          <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Gallery Empty</h2>
          <p className="text-xl">Please configure the database and add products via the Admin console.</p>
        </div>
      ) : (
        <StorefrontGrid 
          products={JSON.parse(JSON.stringify(products))} 
          categories={JSON.parse(JSON.stringify(categories))}
        />
      )}
    </main>
  )
}
