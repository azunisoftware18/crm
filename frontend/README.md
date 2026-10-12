This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin login

This project has no separate backend or database, so the Next.js app provides the admin authentication endpoints. Admin credentials are configured on the server; there is no public registration page or demo login.

1. Copy `.env.example` to `.env.local`.
2. Set `ADMIN_USERNAME` to the administrator's username. Set `ADMIN_EMAIL` and `ADMIN_PHONE` as optional sign-in aliases, and `ADMIN_NAME` to the display name. Phone numbers should include the country code; all three identifiers use the same admin password and permissions.
3. Run `npm run admin:password-hash` in an interactive terminal. Enter a password of at least 10 characters; the script does not echo it. Copy its `ADMIN_PASSWORD_HASH=...` output into `.env.local`.
4. Set `AUTH_SESSION_SECRET` to a fresh random value generated with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

5. Start the app with `npm run dev` and visit `/login`.

### Admin password reset by email

The sign-in page's **Forgot password?** link sends a one-time reset link to the configured admin email. The existing password is never sent by email. The link expires after 20 minutes, the replacement password must be at least 10 characters, and changing it invalidates current admin sessions.

Configure these server-only values in `.env.local` to enable email delivery:

- `ADMIN_EMAIL`: the admin mailbox allowed to request a reset. If omitted, `ADMIN_USERNAME` is used only when it is an email address.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`: credentials and sender for your SMTP provider. Port `465` uses implicit TLS; other configured ports use the provider's STARTTLS support.
- `APP_BASE_URL`: set this to the public `https://` origin in production so reset links use your real site address. Development can use `http://localhost:3000`.
- `ADMIN_AUTH_STORE_PATH` (optional): path for the server-side password override and reset-token hash. The default is `.private/admin-auth.json`, which is ignored by Git.

The credential override contains only a PBKDF2 password hash and reset-token hash, never a plain-text password or reset token. The file-backed override requires persistent writable storage and a single app instance. A serverless or multi-instance deployment needs a shared database-backed credential store.

The password hash and session secret must remain server-side and must not use a `NEXT_PUBLIC_` prefix. The app fails closed when required settings are missing. Admin sign-in accepts the configured username, email, or phone number. Optional `DEV_DEMO_ADMIN_EMAIL` and `DEV_DEMO_ADMIN_PHONE` add aliases to a configured development-only demo login. Sessions expire after eight hours; production cookies are Secure and HTTP-only, and logout clears the session cookie. Use HTTPS in production.

Admin data pages currently use the project's mock data services; there is no database-backed admin API in this repository. Server-side layouts protect all app pages and the admin section. Any future admin API route must call `getAdminSessionFromCookieHeader()` from `src/lib/adminAuth.js` and reject requests without a valid admin session.

Run `npm run test:auth` to build the app and exercise valid and invalid login, session persistence and expiry, logout, and direct access to protected pages. The integration test uses temporary credentials and does not write them to `.env.local`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
