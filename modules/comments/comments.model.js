import db from "../../db.js";

export const getAllComments = async (id_video) => {

    const query = `
        SELECT c.id_comment, c.id_video, c.id_user, c.comments, c.comment_date, u.nickname,
               COALESCE(l.likes_count, 0) as likes_count
        FROM comments c
        JOIN users u ON c.id_user = u.id_user
        LEFT JOIN (
            SELECT id_comment, COUNT(*) as likes_count
            FROM comment_likes
            GROUP BY id_comment
        ) l ON c.id_comment = l.id_comment
        WHERE c.id_video = ?
        ORDER BY c.comment_date DESC
    `;

    const [rows] = await db.query(query, [id_video]);
    return rows;
};


export const postComments = async (id_user, id_video, comments) => {
  const query = `
    INSERT INTO comments (id_user, id_video, comments, comment_date)
    VALUES (?, ?, ?, NOW())
  `;
  const [result] = await db.query(query, [id_user, id_video, comments]);

  const newCommentId = result.insertId;

  const query2 = `
    SELECT c.id_comment, c.id_video, c.id_user, c.comments, c.comment_date, u.nickname
    FROM comments c
    JOIN users u ON c.id_user = u.id_user
    WHERE c.id_comment = ?
  `;
  const [rows] = await db.query(query2, [newCommentId]);

  return rows[0];
};



export const updateComments = async (id_comment, commentData ) => {
    const {comments, id_user} = commentData;

    const [existing] = await db.query("SELECT id_user FROM comments WHERE id_comment = ?", [id_comment]);
    if (!existing.length || existing[0].id_user !== Number(id_user)) {
        const err = new Error("No tienes permiso para editar este comentario");
        err.status = 403;
        throw err;
    }

    const updateQuery = `UPDATE comments SET comments = ? WHERE id_comment = ?`;
        await db.query(updateQuery, [comments, id_comment]);

    const selectQuery = `SELECT * FROM comments WHERE id_comment = ?`;
    const [rows] = await db.query(selectQuery, [id_comment]);

    return rows[0];
};

export const deleteComments = async (id_comment, id_user) => {
    const [existing] = await db.query("SELECT id_user FROM comments WHERE id_comment = ?", [id_comment]);
    if (!existing.length || existing[0].id_user !== Number(id_user)) {
        const err = new Error("No tienes permiso para eliminar este comentario");
        err.status = 403;
        throw err;
    }

    const deleteQuery = `DELETE FROM comments WHERE id_comment = ?`;
    const [result] = await db.query(deleteQuery, [id_comment]);
    return result
};