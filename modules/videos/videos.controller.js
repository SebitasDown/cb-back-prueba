// Business logic (CRUD)
// Here goes the logic for each endpoint (create, read, update, delete).
// Receives video data, uploads the file to Cloudinary, and saves the data in the database.

import cloudinary from "../../cloudinary.js";
import db from "../../db.js"; // Database connection
import { getAllVideos, updateVideo, deleteVideo } from "./videos.model.js";
import fs from "fs";

export const createVideo = async (req, res) => {
    try {
        // 1. Upload the file to Cloudinary
        const file = req.file; // The file uploaded from the frontend
        if (!file) {
            return res.status(400).json({ error: "No file was uploaded" });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "videos", // Cloudinary folder
            resource_type: "video", // File type
        });

        // 2. Get the video duration from Cloudinary
        const duration = result.duration; // Duration in seconds

        // 3. Save the data in the database
        const { title, id_user, id_category } = req.body; // Data sent from the frontend
        const video_date = new Date(); // Current date

        const [rows] = await db.query(
            `INSERT INTO videos (id_user, id_category, duration, title, summary, public_id, url, video_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_user,
                id_category,
                duration,
                title,
                "Automatically generated summary", // Placeholder for summary
                result.public_id, // Cloudinary public ID
                result.secure_url, // Cloudinary video URL
                video_date,
            ]
        );

        // 4. Respond to the client
        res.status(201).json({
            message: "Video created successfully",
            video: {
                id_video: rows.insertId,
                title,
                duration,
                video_date,
                url: result.secure_url,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating video" });
    }
};


// GET all videos
export const getAllVideosController = async (req, res) => {
    try {
        const videos = await getAllVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "Error fetching videos" });
    }
};


// UPDATE video
export const updateVideoController = async (req, res) => {
    try {
        const id = req.params.id;
        let videoData = req.body;

        // If a new file is provided, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "videos",
                resource_type: "video",
            });
            videoData.public_id = result.public_id;
            videoData.url = result.secure_url;
            videoData.duration = result.duration;
        }

        videoData.video_date = new Date(); // Update the date

        const result = await updateVideo(id, videoData);
        res.json({ message: "Video updated", result });
    } catch (error) {
        res.status(500).json({ error: "Error updating video" });
    }
};

// DELETE video
export const deleteVideoController = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteVideo(id);
        res.json({ message: "Video deleted", result });
    } catch (error) {
        res.status(500).json({ error: "Error deleting video" });
    }
};