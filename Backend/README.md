# College Management Backend

Express + MongoDB API for the React college management app.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally, then seed demo data:

```bash
npm run seed
```

4. Run the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Demo Login

- Student: `alex.johnson@student.edu` / `password`
- Faculty: `michael.brown@faculty.edu` / `password`
- Admin: `jennifer.davis@admin.edu` / `password`

## Main Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `PATCH /api/users/profile`
- `GET /api/courses`
- `GET /api/courses/subjects`
- `GET /api/events`
- `GET /api/events/registrations/me`
- `POST /api/events/:id/register`
- `GET /api/academic/attendance`
- `POST /api/academic/attendance`
- `GET /api/academic/grades`
- `GET /api/academic/assignments`
- `GET /api/academic/materials`
- `GET /api/academic/submissions`
- `GET /api/dashboard/summary`
- `GET /api/leave-requests`
- `POST /api/leave-requests`
- `GET /api/library`
- `POST /api/library/books/:bookId/reserve`
- `PATCH /api/library/loans/:loanId/renew`
- `PATCH /api/library/loans/:loanId/return`
- `GET /api/settings`
- `PATCH /api/settings`
- `POST /api/reports/export`
