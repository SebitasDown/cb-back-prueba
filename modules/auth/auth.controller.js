import bcrypt from "bcryptjs";
import db from "../../db.js";
import { findEmail, findNickname, createUser, verifyUser, findByResetToken, updatePassword } from "./auth.model.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "./mailer.js";

export const login = async (req, res) => {
  try {
    const { email, user_password } = req.body;

    const user = await findEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(user_password, user.user_password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email before logging in", needsVerification: true, email: user.email });
    }

    return res.json({
      message: "login successful",
      user: {
        id_user: user.id_user,
        email: user.email,
        full_name: user.full_name,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { full_name, nickname, email, user_password } = req.body;

    if (!full_name || !email || !user_password) {
      return res.status(400).json({ message: "full_name, email and user_password are required" });
    }

    const existing = await findEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    let finalNickname = nickname || full_name.split(" ")[0];
    const existingNickname = await findNickname(finalNickname);
    if (existingNickname) {
      finalNickname = `${finalNickname}${Math.floor(Math.random() * 1000)}`;
    }

    const verification_code = Math.floor(100000 + Math.random() * 900000).toString();
    const verification_code_expires = new Date(Date.now() + 15 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const id_user = await createUser({
      full_name,
      nickname: finalNickname,
      email,
      user_password: hashedPassword,
      verification_code,
      verification_code_expires
    });

    try {
      await sendVerificationEmail(email, verification_code);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }

    return res.status(201).json({
      message: "registration successful. Please check your email for the verification code.",
      needsVerification: true,
      email
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await findEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or code" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.verification_code !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date(user.verification_code_expires) < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    await verifyUser(email);

    return res.json({
      message: "Email successfully verified. You can now log in.",
      verified: true
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findEmail(email);
    if (!user) {
      return res.json({ message: "If that email exists, a code has been sent." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE users SET verification_code = ?, verification_code_expires = ? WHERE email = ?",
      [code, expires, email]
    );

    try {
      await sendVerificationEmail(email, code);
    } catch (error) {
      console.error("Error sending reset code:", error);
    }

    return res.json({ message: "If that email exists, a code has been sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, new_password } = req.body;

    if (!new_password) {
      return res.status(400).json({ message: "new_password is required" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    if (email) {
      const user = await findEmail(email);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      await updatePassword(email, hashedPassword);
      return res.json({ message: "Password successfully reset. You can now log in." });
    }

    if (!token) {
      return res.status(400).json({ message: "Token or email is required" });
    }

    const user = await findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    await updatePassword(user.email, hashedPassword);

    return res.json({ message: "Password successfully reset. You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
