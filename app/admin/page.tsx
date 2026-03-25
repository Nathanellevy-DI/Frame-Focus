import AdminProductForm from '@/components/AdminProductForm'
import { logoutAction } from '@/app/admin/auth-actions'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4 md:px-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-gray-800 pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Frame &amp; Focus — Admin
          </h1>
          <p className="text-sm uppercase tracking-widest text-gray-400 mt-2">Executive Operations</p>
          <form action={logoutAction} className="mt-4">
            <button type="submit" className="text-xs uppercase tracking-widest text-gray-600 hover:text-white border border-gray-800 px-4 py-2 transition-colors">
              Logout
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <section className="lg:col-span-4">
            <AdminProductForm />
          </section>

          <section className="lg:col-span-8">
            <div className="bg-white text-black p-8 h-full min-h-[500px]">
              <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase border-b-2 border-black pb-4">
                Orders Ledger
              </h2>
              
              {!orders || orders.length === 0 ? (
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold border-l-4 border-black pl-4 py-2">
                  System awaiting active orders stream...
                </p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="font-mono text-xs text-gray-400 mb-1">
                          ID: {order.id.split('-')[0]} • {new Date(order.created_at).toLocaleString()}
                        </div>
                        <div className="text-lg font-bold tracking-tighter">
                          {order.customer_email || 'Guest Checkout'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black tracking-tighter">
                          ${parseFloat(String(order.total_amount)).toFixed(2)}
                        </div>
                        <div className={`mt-2 inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
