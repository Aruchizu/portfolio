# Aviation Photography Portfolio

Apple-led, gallery-first photography portfolio with Austrian red/white styling.
The public site is backed by MongoDB photo records and Cloudinary-hosted image
uploads through a private admin page.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- MongoDB Atlas for photo metadata
- Cloudinary for uploaded image files
- NextAuth credentials login for a single admin
- Vitest for focused helper tests

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with your MongoDB Atlas, Cloudinary, and admin credentials.
Without MongoDB configured, the public gallery stays empty and points you to the
admin login so you can upload your own photos.

For production, use `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.
Generate a bcrypt hash in Node:

```bash
node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"
```

## Routes

- `/` - photo-first homepage
- `/gallery` - filterable public gallery
- `/admin/login` - admin sign in
- `/admin/photos` - protected upload dashboard
- `/api/photos` - published public photo records
- `/api/admin/photos` - protected upload endpoint

## Verification

```bash
npm test
npm run lint
npm run build
```
