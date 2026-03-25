import postgres from 'postgres'

// Prevents multiple connections in development mode
const globalForPostgres = global;

const sql = globalForPostgres.postgres || postgres(process.env.DATABASE_URL || 'postgres://placeholder:5432/placeholder', {
  ssl: 'require', // Required for Supabase external connections
});

if (process.env.NODE_ENV !== 'production') globalForPostgres.postgres = sql;

export default sql;
