import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, code) {
  const html = `
    <div style="font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 50px 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <h1 style="margin: 0; color: #171E4A; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">CoderBoost</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; text-align: center; margin-top: 0; margin-bottom: 20px;">Verify your email</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 35px;">
            Thanks for joining CoderBoost! Use this code to verify your account:
          </p>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; text-align: center; margin: 0 auto; max-width: 320px;">
            <span style="display: block; font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; color: #715CFF; letter-spacing: 12px; margin-left: 12px;">
              ${code}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 35px;">
            This code expires in <strong>15 minutes</strong>.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
            If you didn't register, please ignore this email.<br>
            &copy; 2026 CoderBoost. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"CoderBoost" <noreply@coderboost.app>',
    to: email,
    subject: "CoderBoost - Verify your email",
    text: `Your verification code is: ${code}. It expires in 15 minutes.`,
    html,
  });
}

export async function sendResetPasswordEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 50px 20px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <h1 style="margin: 0; color: #171E4A; font-size: 34px; font-weight: 800; letter-spacing: -0.5px;">CoderBoost</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; text-align: center; margin-top: 0; margin-bottom: 20px;">Forgot your password?</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 35px;">
            Click the button below to set a new password for your account.
          </p>
          <div style="text-align: center; margin: 0 auto;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #715CFF; color: #ffffff; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none; letter-spacing: 0.3px;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 35px;">
            This link expires in <strong>15 minutes</strong>.<br>
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0;">
            &copy; 2026 CoderBoost. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"CoderBoost" <noreply@coderboost.app>',
    to: email,
    subject: "CoderBoost - Reset your password",
    text: `Click this link to reset your password: ${resetUrl}. Expires in 15 minutes.`,
    html,
  });
}
