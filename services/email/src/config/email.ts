import nodemailer from "nodemailer";

export const transporter = nodemailer.createTranport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || "2525",
});

export const DefaultSenderAddress =
  process.env.DEFAULT_EMAIL_SENDER || "munira@muniraakter.com";
