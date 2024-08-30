import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || "2525",
});

export const DefaultSenderAddress =
  process.env.DEFAULT_EMAIL_SENDER || "munira@muniraakter.com";
