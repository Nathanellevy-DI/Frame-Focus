import postgres from 'postgres'

const sql = postgres('postgresql://postgres:Cpxkjkaz5Nigl8CM@db.czdhymqvepshaysyyoed.supabase.co:5432/postgres', {
  ssl: 'require'
})

async function check() {
  const products = await sql`SELECT id, title, created_at FROM products ORDER BY created_at DESC`
  console.log(`Found ${products.length} products:`)
  for (const p of products) {
    console.log(`- ${p.title} (${p.created_at})`)
  }
  process.exit(0)
}

check().catch(console.error)
