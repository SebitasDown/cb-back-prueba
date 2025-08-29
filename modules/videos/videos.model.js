// SQL queries (you can move the DB logic here)

// Functions to create, read, update, and delete videos in the database
// Each function executes an SQL query and returns the result.


import db from "../../db.js";

// Get all videos
export const getAllVideos = async () => {
    const [rows] = await db.query("SELECT * FROM videos");
    return rows;
};


// Update a video
export const updateVideo = async (id, videoData) => {
    const [rows] = await db.query(
        `UPDATE videos SET 
            id_user = ?, 
            id_category = ?, 
            duration = ?, 
            title = ?, 
            summary = ?, 
            public_id = ?, 
            video_date = ?, 
            url = ?
         WHERE id_video = ?`,
        [
            videoData.id_user,
            videoData.id_category,
            videoData.duration,
            videoData.title,
            videoData.summary,
            videoData.public_id,
            videoData.video_date,
            videoData.url,
            id
        ]
    );
    return rows;
};

// Delete a video
export const deleteVideo = async (id) => {
    const [rows] = await db.query("DELETE FROM videos WHERE id_video = ?", [id]);
    return rows;
};