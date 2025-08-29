// Rutas para categorías
// Define los endpoints para obtener información de categorías

import express from "express";
import { getAllCategories } from "./categories.controller.js";

const router = express.Router();

// Endpoints
router.get("/", getAllCategories);

export default router;
