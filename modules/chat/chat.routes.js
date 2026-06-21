import express from "express";
import { askVideo, createSessionHandler, getSessionsHandler, getSessionMessagesHandler } from "./chat.controller.js";

const router = express.Router();

router.post("/", askVideo);
router.post("/sessions", createSessionHandler);
router.get("/sessions", getSessionsHandler);
router.get("/sessions/:sessionId/messages", getSessionMessagesHandler);

export default router;
