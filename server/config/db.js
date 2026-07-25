import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool } = pg;

void ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? "✅ Loaded" : "❌ Missing",
});

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error("DATABASE_URL is required for the Neon PostgreSQL connection.");
}

let neonHost;

try {
  const databaseUrl = new URL(connectionString);

  if (!databaseUrl.protocol.startsWith("postgres")) {
    throw new Error("DATABASE_URL must use the postgresql:// protocol.");
  }

  neonHost = databaseUrl.hostname;
} catch (error) {
  throw new Error(`Invalid DATABASE_URL: ${error.message}`);
}

const pool = new Pool({
  connectionString,
  // Neon requires encrypted remote connections.
  ssl: { rejectUnauthorized: false },
  max: Number(process.env.DB_POOL_MAX || 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
});

console.log(`PostgreSQL configured for Neon host: ${neonHost}`);

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
