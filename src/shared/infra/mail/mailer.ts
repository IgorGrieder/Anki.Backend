import nodemailer from "nodemailer";

const from = process.env.MAIL_FROM || "no-reply@example.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Boolean(process.env.SMTP_SECURE === "true"),
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export type MailJob = { to: string; subject: string; html: string };

export const sendMail = async (job: MailJob): Promise<void> => {
  await transporter.sendMail({
    from,
    to: job.to,
    subject: job.subject,
    html: job.html,
  });
};
