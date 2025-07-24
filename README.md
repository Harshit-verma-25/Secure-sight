# Secure Sight

A comprehensive security camera management system

## Deployment Instructions

###### 1. Clone the repository

```
git clone https://github.com/Harshit-verma-25/Secure-sight.git
cd Secure-sight
```

###### 2. Install Dependencies

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

###### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```
DATABASE_URL=your_neon_postgres_connection_url
```

###### 4. Generate Prisma client and push schema

```
npx prisma generate
npx prisma db push
```

###### 5. Seed the database

```
npx prisma db seed
```

###### 6. Run the development server

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Tech Decisions

- Modern file-based routing with server actions and route handlers using `Next JS`
- Used `Tailwind CSS` for utility-first CSS for rapid UI development.
- Type-safe interaction with PostgreSQL (Neon DB).

## Future Improvement

1. Add authentication and role-based access control
2. Implement real-time incident updates via WebSockets
3. Implement better error and loading states
4. Enable image/video previews and playback from thumbnails
5. Optimize Lighthouse score for performance/accessibility

