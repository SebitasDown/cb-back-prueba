// Controlador para speakers (usuarios con rol team leader)
// Obtiene los usuarios que pueden ser speakers de videos

import db from "../../db.js";

// GET all speakers (users with team leader role)
export const getAllSpeakers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id_user, u.full_name, u.nickname, u.email, r.role_name
            FROM users u
            INNER JOIN roles r ON u.id_role = r.id_role
            WHERE r.role_name = 'team leader'
            ORDER BY u.full_name
        `);
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching speakers:", error);
        res.status(500).json({ error: "Error fetching speakers" });
    }
};





