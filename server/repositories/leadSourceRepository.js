import pool from "../config/db.js";

export const getAllLeadSourcesRepository = async () => {
  const query = `
    SELECT id, name, description, is_active, is_deleted, created_at, updated_at
    FROM lead_sources
    WHERE is_deleted = FALSE
    ORDER BY name;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const findLeadSourceByIdRepository = async (id) => {
  const query = `
    SELECT id, name, description, is_active, is_deleted, created_at, updated_at
    FROM lead_sources
    WHERE id = $1 AND is_deleted = FALSE;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createLeadSourceRepository = async (client, data) => {
  const { name, description, created_by } = data;

  const query = `
    INSERT INTO lead_sources (name, description, created_by)
    VALUES ($1, $2, $3)
    RETURNING id, name, description, is_active, created_at, updated_at;
  `;

  const values = [name, description || null, created_by || null];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const updateLeadSourceRepository = async (client, id, data) => {
  const { name, description, is_active } = data;

  const query = `
    UPDATE lead_sources
    SET name = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND is_deleted = FALSE
    RETURNING id, name, description, is_active, updated_at;
  `;

  const values = [name, description || null, is_active, id];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const deleteLeadSourceRepository = async (client, id) => {
  const query = `
    UPDATE lead_sources
    SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id;
  `;

  const result = await client.query(query, [id]);
  return result.rows[0];
};
