import db from "../../db.js";

export const findEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const findNickname = async (nickname) => {
    const [rows] = await db.query("SELECT * FROM users WHERE nickname = ?", [nickname]);
    return rows[0];
};

export const createUser = async ({ full_name, nickname, email, user_password, verification_code, verification_code_expires }) => {
    const [result] = await db.query(
        "INSERT INTO users (full_name, nickname, email, user_password, id_role, verification_code, verification_code_expires) VALUES (?, ?, ?, ?, 3, ?, ?)",
        [full_name, nickname, email, user_password, verification_code, verification_code_expires]
    );
    return result.insertId;
};

export const verifyUser = async (email) => {
    const [result] = await db.query(
        "UPDATE users SET is_verified = 1, verification_code = NULL, verification_code_expires = NULL WHERE email = ?",
        [email]
    );
    return result.affectedRows > 0;
};

export const saveResetToken = async (email, token, expires) => {
    const [result] = await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
        [token, expires, email]
    );
    return result.affectedRows > 0;
};

export const findByResetToken = async (token) => {
    const [rows] = await db.query("SELECT * FROM users WHERE reset_token = ?", [token]);
    return rows[0];
};

export const updatePassword = async (email, newPassword) => {
    const [result] = await db.query(
        "UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?",
        [newPassword, email]
    );
    return result.affectedRows > 0;
};
