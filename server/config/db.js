import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
import logger from "../utils/logger.js";
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

// Neon may close an idle pooled connection. The pg pool will replace it on the
// next query, but this listener is required so the connection error does not
// become an uncaught Node exception and stop the whole API service.
pool.on("error", (error) => {
  logger.error("PostgreSQL pool client error; connection will be replaced.", {
    error: error.message,
    stack: error.stack,
  });
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
