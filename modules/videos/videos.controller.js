// Business logic (CRUD)
// Here goes the logic for each endpoint (create, read, update, delete).

import cloudinary from "../../cloudinary.js";
import db from "../../db.js";
import { getAllVideos, updateVideo, deleteVideo } from "./videos.model.js";
import fs from "fs";
import Groq from "groq-sdk";

// ──────────────────────────────────────────────
// GET /videos/upload-signature
// Generates a secure Cloudinary signature so the
// frontend can upload directly (without exposing the API secret).
// ──────────────────────────────────────────────
export const getUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        const paramsToSign = {
            timestamp,
            folder: "videos",
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error) {
        console.error("Error generating upload signature:", error);
        res.status(500).json({ error: "Error generating upload signature" });
    }
};

// ──────────────────────────────────────────────
// POST /videos/create
// Receives metadata + Cloudinary URL from the frontend.
// No file handling here — the frontend uploads directly to Cloudinary.
//
// Flow:
//   1. Transform .mp4 → .mp3 URL (Cloudinary on-the-fly transcoding)
//   2. Download the MP3 to /tmp
//   3. Transcribe with Groq Whisper
//   4. Save to database
//   5. Clean up /tmp
// ──────────────────────────────────────────────
export const createVideo = async (req, res) => {
    let tempAudioPath = null;

    try {
        const { title, id_user, id_category, url, public_id, duration } = req.body;

        if (!url) {
            return res.status(400).json({ error: "No video URL was provided" });
        }

        // 1. Transform the Cloudinary video URL to .mp3 format
        const extensionIndex = url.lastIndexOf(".");
        if (extensionIndex === -1) {
            return res.status(400).json({ error: "Invalid video URL structure" });
        }
        const audioUrl = url.substring(0, extensionIndex) + ".mp3";
        console.log("🎵 Cloudinary audio URL:", audioUrl);

        // 2. Download the MP3 to a temporary file
        tempAudioPath = `/tmp/${Date.now()}-audio.mp3`;
        console.log("⬇️  Downloading audio to:", tempAudioPath);

        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
            throw new Error(
                `Failed to download audio from Cloudinary: ${audioResponse.statusText}`
            );
        }
        const arrayBuffer = await audioResponse.arrayBuffer();
        fs.writeFileSync(tempAudioPath, Buffer.from(arrayBuffer));
        console.log("✅ Audio downloaded successfully");

        // 3. Transcribe with Groq Whisper
        console.log("🤖 Sending audio to Groq Whisper...");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempAudioPath),
            model: "whisper-large-v3",
        });

        const transcriptText = transcription.text || "No transcription available";
        console.log(
            "✅ Transcription done:",
            transcriptText.substring(0, 100) + "..."
        );

        // 4. Save the video to the database
        const video_date = new Date();
        const [rows] = await db.query(
            `INSERT INTO videos (id_user, id_category, duration, title, summary, public_id, url, video_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_user,
                id_category,
                duration || 0,
                title,
                transcriptText,
                public_id,
                url,
                video_date,
            ]
        );
        console.log("✅ Video saved to DB, id:", rows.insertId);

        // 5. Clean up temp audio file
        try {
            fs.unlinkSync(tempAudioPath);
            console.log("🗑️  Temp audio file deleted");
        } catch (unlinkErr) {
            console.error("⚠️  Error deleting temp audio:", unlinkErr.message);
        }

        res.status(201).json({
            message: "Video created and transcribed successfully",
            video: {
                id_video: rows.insertId,
                title,
                duration,
                video_date,
                url,
                summary: transcriptText,
            },
        });
    } catch (error) {
        // Clean up on error too
        if (tempAudioPath) {
            try { fs.unlinkSync(tempAudioPath); } catch (_) {}
        }
        console.error("❌ Error in createVideo:", error);
        res.status(500).json({
            error: "Error creating and transcribing video",
            details: error.message,
        });
    }
};

// ──────────────────────────────────────────────
// GET /videos
// ──────────────────────────────────────────────
export const getAllVideosController = async (req, res) => {
    try {
        const videos = await getAllVideos();
        res.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Error fetching videos" });
    }
};

// ──────────────────────────────────────────────
// PUT /videos/:id
// ──────────────────────────────────────────────
export const updateVideoController = async (req, res) => {
    try {
        const { id } = req.params;
        const videoData = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "videos",
                resource_type: "video",
            });
            videoData.url = result.secure_url;
            videoData.public_id = result.public_id;
        }

        const updatedVideo = await updateVideo(id, videoData);
        res.json({ message: "Video updated successfully", video: updatedVideo });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ error: "Error updating video" });
    }
};

// ──────────────────────────────────────────────
// DELETE /videos/:id
// ──────────────────────────────────────────────
export const deleteVideoController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVideo = await deleteVideo(id);
        res.json({ message: "Video deleted successfully", video: deletedVideo });
    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ error: "Error deleting video" });
    }
};
