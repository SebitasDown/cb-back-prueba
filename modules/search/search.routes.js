import express from "express";
import { searchVideos } from "./search.controller.js";

const router = express.Router();
router.get("/", searchVideos);
export default router;
