# car-management

## backend

create `test-backend/.env` from `.env.example` and update `DATABASE_URL`

```bash
cd test-backend
npm install
npx prisma db push
npm run dev
```

## web

```bash
cd test-web
npm install
npm run dev
```
