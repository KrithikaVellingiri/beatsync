// Uses pg directly (no Prisma) to inspect actual columns
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  const tables = ['distributors', 'users', 'distributor_members'];
  for (const table of tables) {
    const r = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);
    console.log(`\n=== ${table} ===`);
    console.table(r.rows);
  }
  await pool.end();
}

main().catch(e => { console.error(e.message); pool.end(); });
