import db from "../../db.js";

export const toggleLike = async (req, res) => {
  try {
    const { id_comment } = req.params;
    const { id_user } = req.body;

    if (!id_comment || !id_user) {
      return res.status(400).json({ error: "id_comment y id_user son requeridos" });
    }

    const [existing] = await db.query(
      "SELECT id_like FROM comment_likes WHERE id_comment = ? AND id_user = ?",
      [id_comment, id_user]
    );

    if (existing.length > 0) {
      await db.query("DELETE FROM comment_likes WHERE id_like = ?", [existing[0].id_like]);
      return res.json({ liked: false });
    } else {
      await db.query("INSERT INTO comment_likes (id_comment, id_user) VALUES (?, ?)", [id_comment, id_user]);
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error("Error en toggleLike:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCommentLikes = async (req, res) => {
  try {
    const { id_comment } = req.params;
    const { id_user } = req.query;

    const [count] = await db.query(
      "SELECT COUNT(*) as total FROM comment_likes WHERE id_comment = ?",
      [id_comment]
    );

    let userLiked = false;
    if (id_user) {
      const [userLike] = await db.query(
        "SELECT id_like FROM comment_likes WHERE id_comment = ? AND id_user = ?",
        [id_comment, id_user]
      );
      userLiked = userLike.length > 0;
    }

    res.json({ total: count[0].total, userLiked });
  } catch (error) {
    console.error("Error en getCommentLikes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
