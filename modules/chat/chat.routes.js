// chat.routes.js
import express from "express";
import { askVideo } from "./chat.controller.js";

const router = express.Router();
router.post("/", askVideo);

export default router;
