import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAllLeadSourcesService,
  getLeadSourceByIdService,
  createLeadSourceService,
  updateLeadSourceService,
  deleteLeadSourceService,
} from "../services/leadSourceService.js";

export const getAllLeadSources = asyncHandler(async (req, res) => {
  const sources = await getAllLeadSourcesService();
  res.status(200).json({ success: true, data: sources });
});

export const getLeadSourceById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const source = await getLeadSourceByIdService(id);
  res.status(200).json({ success: true, data: source });
});

export const createLeadSource = asyncHandler(async (req, res) => {
  const payload = req.body;
  const created = await createLeadSourceService({
    ...payload,
    created_by: req.user?.id || null,
  });
  res.status(201).json({ success: true, data: created });
});

export const updateLeadSource = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await updateLeadSourceService(id, req.body);
  res.status(200).json({ success: true, data: updated });
});

export const deleteLeadSource = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = await deleteLeadSourceService(id);
  res.status(200).json({ success: true, data: deleted });
});
