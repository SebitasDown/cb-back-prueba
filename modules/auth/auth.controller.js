
import { findEmail } from "./auth.model.js";

export const login = async (req, res) => {
  const { email, user_password } = req.body;

  const user = await findEmail(email);
  if (!user) {
    return res.json({ message: "user no find" });
  }

  if (user.user_password !== user_password) {
    return res.json({ message: "Invalid email or password" });
  }
  return res.json({
    message: "login successful",
    user: {
      id_user: user.id_user,
      email: user.email
    }
  });
};
