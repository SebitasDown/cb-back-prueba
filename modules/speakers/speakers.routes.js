// Rutas para speakers
// Define los endpoints para obtener información de speakers (team leaders)

import express from "express";
import { getAllSpeakers } from "./speakers.controller.js";

const router = express.Router();

// Endpoints
router.get("/", getAllSpeakers);

export default router;
