import AdminProductForm from '@/components/AdminProductForm'
import { logoutAction } from '@/app/admin/auth-actions'

export default function AdminPage() {
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
          <section className="lg:col-span-5">
            <AdminProductForm />
          </section>

          <section className="lg:col-span-7">
            <div className="bg-white text-black p-8 h-full min-h-[500px]">
              <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase border-b-2 border-black pb-4">
                Orders Ledger
              </h2>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold border-l-4 border-black pl-4 py-2">
                  System awaiting active orders stream...
                </p>
                {/* We can populate this with SELECT * FROM orders down the line */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
