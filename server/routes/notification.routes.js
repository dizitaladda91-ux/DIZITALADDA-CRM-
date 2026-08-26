import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

export default router;
