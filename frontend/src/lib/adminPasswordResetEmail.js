import nodemailer from 'nodemailer';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function isPasswordResetEmailConfigured() {
  const port = Number(process.env.SMTP_PORT);
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
    Number.isInteger(port) && port > 0 && port < 65536 &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_FROM?.trim(),
  );
}

export async function sendAdminPasswordResetEmail({ to, resetUrl }) {
  if (!isPasswordResetEmailConfigured()) throw new Error('Password reset email is not configured.');

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const safeResetUrl = escapeHtml(resetUrl);

  await transporter.sendMail({
    from: process.env.SMTP_FROM.trim(),
    to,
    subject: 'Reset your Shree Nath admin password',
    text: `We received a request to reset your Shree Nath admin password. Use this one-time link within 20 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>We received a request to reset your Shree Nath admin password.</p><p><a href="${safeResetUrl}">Choose a new password</a></p><p>This one-time link expires in 20 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}
