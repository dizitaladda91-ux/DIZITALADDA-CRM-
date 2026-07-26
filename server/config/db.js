import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const rawConnectionString = process.env.DATABASE_URL || "";
const normalizedConnectionString = rawConnectionString
  .replace(/^DATABASE_URL\s*=\s*/, "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

if (!normalizedConnectionString) {
  throw new Error("❌ DATABASE_URL is missing in environment variables.");
}

const pool = new Pool({
  connectionString: normalizedConnectionString,
  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL (Neon) Connected Successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Error:", err.message);
    process.exit(1);
  });

export async function query(text, params) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export default pool;