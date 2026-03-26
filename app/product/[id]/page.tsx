import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ProductVariantSelector from '@/components/ProductVariantSelector'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const { data: product } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single()
    
    // Sort variants by price ascending if they exist
    if (product?.product_variants) {
      product.product_variants.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price))
    }

    if (!product) return notFound()

    return (
      <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
        {/* Back nav */}
        <div className="border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-sm font-black uppercase tracking-widest hover:underline">
              ← Back to Gallery
            </Link>
            <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
              Frame &amp; Focus
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Product Image */}
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden shadow-2xl">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">
                {product.category || 'Fine Art Print'}
              </p>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                {product.title}
              </h1>
              
              {product.description && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-black pl-6">
                  {product.description}
                </p>
              )}

              <ProductVariantSelector 
                product={product} 
                variants={product.product_variants || []} 
              />

              <div className="mt-12 space-y-4 border-t border-gray-200 pt-8">
                <div className="flex items-start gap-3">
                  <span className="text-sm">🖼</span>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Museum-quality giclée print on archival paper</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm">📦</span>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Ships within 2–5 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm">↩️</span>
                  <p className="text-xs uppercase tracking-widest text-gray-500">30-day satisfaction guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (err) {
    console.error(err)
    return notFound()
  }
}
