// Controlador para categorías
// Obtiene las categorías disponibles para los videos

import db from "../../db.js";

// GET all categories
export const getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY category_name");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Error fetching categories" });
    }
};

