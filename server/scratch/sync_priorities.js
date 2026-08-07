import dotenv from "dotenv";
dotenv.config();
import pool from "../config/db.js";

async function run() {
  try {
    const updateHigh = await pool.query(
      "UPDATE leads SET priority = 'HIGH' WHERE UPPER(status) IN ('WALK_IN_SCHEDULED', 'WALKED_IN', 'QUALIFIED', 'INTERESTED');"
    );
    const updateMed = await pool.query(
      "UPDATE leads SET priority = 'MEDIUM' WHERE UPPER(status) IN ('FOLLOW_UP', 'FOLLOW_UP_REQUIRED');"
    );
    const updateLow = await pool.query(
      "UPDATE leads SET priority = 'LOW' WHERE UPPER(status) IN ('CONTACTED', 'NOT_CONTACTED', 'NEW', 'PENDING', 'LOST', 'NOT_INTERESTED', 'REJECTED', 'ADMISSION_DONE', 'ENROLLED', 'COMPLETED');"
    );

    console.log("✅ Lead Priorities synced in PostgreSQL database successfully:");
    console.log("- HIGH priority updated:", updateHigh.rowCount);
    console.log("- MEDIUM priority updated:", updateMed.rowCount);
    console.log("- LOW priority updated:", updateLow.rowCount);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing DB priorities:", err);
    process.exit(1);
  }
}

run();
