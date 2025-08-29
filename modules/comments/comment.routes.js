import express from "express";
import { getComent, createComment, updateComent, deleteComment } from "./comments.controller.js";

const router = express.Router();
router.get("/", getComent);
router.post("/", createComment);
router.put("/:id_comment", updateComent);
router.delete("/:id_comment", deleteComment);

export default router