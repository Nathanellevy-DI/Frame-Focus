import sql from '@/lib/db'
import Link from 'next/link'
import StorefrontGrid from '@/components/StorefrontGrid'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  let products: any[] = [];
  try {
    products = await sql`SELECT * FROM products WHERE is_available = true ORDER BY created_at DESC;`
  } catch (err) {
    console.error("Database error:", err);
  }

  return (
    <main className="min-h-screen bg-white text-black p-8 md:p-16 selection:bg-black selection:text-white">
      <header className="mb-20 border-b-8 border-black pb-8">
        <div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
            Frame &amp; Focus
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-widest mt-4">Prints</p>
        </div>
      </header>
      
      {products.length === 0 ? (
        <div className="text-center py-32 border-4 border-black bg-gray-50">
          <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Gallery Empty</h2>
          <p className="text-xl">Please configure the database and add products via the Admin console.</p>
        </div>
      ) : (
        <StorefrontGrid products={JSON.parse(JSON.stringify(products))} />
      )}
    </main>
  )
}
