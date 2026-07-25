import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool } = pg;

console.log("DB Config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? "✅ Loaded" : "❌ Missing",
});

const useConnectionString = Boolean(process.env.DATABASE_URL);
// Supabase requires TLS for remote PostgreSQL connections. Set DB_SSL=false
// only for a trusted local PostgreSQL instance.
const useSsl = useConnectionString && process.env.DB_SSL !== "false";

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
        max: Number(process.env.DB_POOL_MAX || 5),
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: Number(process.env.DB_POOL_MAX || 5),
      }
);

pool
  .connect()
  .then((client) => {
    client.release();
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => console.error("❌ PostgreSQL Error:", err.message));

/* ============================================================================
 * Transaction Helper
 * ============================================================================
 */

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
