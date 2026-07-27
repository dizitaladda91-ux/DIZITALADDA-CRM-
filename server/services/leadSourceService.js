import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import {
  getAllLeadSourcesRepository,
  findLeadSourceByIdRepository,
  createLeadSourceRepository,
  updateLeadSourceRepository,
  deleteLeadSourceRepository,
} from "../repositories/leadSourceRepository.js";

export const getAllLeadSourcesService = async () => {
  return await getAllLeadSourcesRepository();
};

export const getLeadSourceByIdService = async (id) => {
  const source = await findLeadSourceByIdRepository(id);
  if (!source) throw new ApiError(404, "Lead source not found.");
  return source;
};

export const createLeadSourceService = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (!data.name) throw new ApiError(400, "Name is required.");

    const created = await createLeadSourceRepository(client, data);

    await client.query("COMMIT");
    return created;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateLeadSourceService = async (id, data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updated = await updateLeadSourceRepository(client, id, data);
    if (!updated) throw new ApiError(404, "Lead source not found.");

    await client.query("COMMIT");
    return updated;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteLeadSourceService = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleted = await deleteLeadSourceRepository(client, id);
    if (!deleted) throw new ApiError(404, "Lead source not found.");

    await client.query("COMMIT");
    return deleted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
