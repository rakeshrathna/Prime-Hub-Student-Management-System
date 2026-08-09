# Prime Hub — Frontend

A React console for the Prime Hub Student Management System backend, covering
the Admin, Teacher and Student roles end to end.

## Stack

- React 19 + Vite
- react-router-dom for routing and role-based route guards
- axios for API calls
- Plain CSS with a small design-token system (no UI framework) — see
  `src/styles/`

No mock data anywhere: every screen reads from and writes to the real
Spring Boot API.

## Getting started

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev
```

The dev server runs on **port 5173** by default and is pinned there in
`vite.config.js`. This matters because the backend's CORS configuration
(`SecurityConfig.java`) only whitelists `http://localhost:5173` and the
production Vercel URL — if you change the port, update the backend's
`corsConfigurationSource()` allowed origins too, or requests will be blocked
by the browser.

Make sure the backend is running (`mvn spring-boot:run` from the project
root, or via your IDE) before signing in.

## Demo accounts

Seeded by `DataSeeder.java` on backend startup:

| Role    | Email              | Password      |
|---------|--------------------|---------------|
| Admin   | admin@school.com   | password123   |
| Teacher | jeeva@gmail.com    | password123   |
| Student | raju@gmail.com     | password123   |

The login screen has one-click buttons to fill these in.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. `npm run preview` serves the production build
locally (also pinned to port 5173).

## Project structure

```
src/
  api/            One module per backend controller area (auth, admin,
                   teacher, tasks, student, school). Every function maps
                   1:1 to a real endpoint — see comments above each call.
  components/
    common/       Generic UI building blocks (Modal, Table bits, Badge, ...)
    layout/       Sidebar, Topbar, AppLayout shell
    shared/       Feature panels reused across roles (leave approvals,
                   announcements board)
  context/        AuthContext (session/JWT) and ToastContext (notifications)
  pages/
    admin/        Dashboard, user management, tasks, leave approvals,
                   announcements
    teacher/      Dashboard, students, teams, tasks, grading, leave
                   approvals, announcements, student notes
    student/      Dashboard, tasks, team, leave requests, announcements,
                   notes from teachers, profile
  routes/         ProtectedRoute (auth + role gate)
  styles/         Design tokens, base reset, shared component styles,
                   app-shell layout, auth screen
  utils/          Formatting helpers, sidebar nav configuration
```

## Design notes

The interface intentionally avoids rounded corners, decorative icons and
gradients — a flat, high-contrast operations-console aesthetic (white
surface, navy sidebar, a single blue accent, hairline gray borders).
Space Grotesk is used for headings, Inter for body text and IBM Plex Mono
for identifiers, dates and numeric data.

## Known backend/frontend mapping notes

While wiring this frontend up against the existing backend, one gap was
found and fixed directly in the backend (`AuthController.login`): the login
response did not include `phoneNumber`, so the profile screen couldn't
display a student's existing number until they changed it. This field is
now included in the login response.

A few backend role-permission quirks worth knowing if you extend this app:

- `/api/teacher/**` requires the `TEACHER` role specifically — Admin accounts
  cannot call the students/teams endpoints under that path, even though they
  can manage everything via `/api/admin/**`. The Admin console therefore uses
  `/api/admin/users` for its user list rather than `/api/teacher/students`.
- Only `STUDENT` accounts can `POST`/`PUT` to `/api/student/**` (submitting
  work, updating their own profile). Admin/Teacher accounts can only `GET`
  from that path.
- `POST /api/tasks/grade` takes `teacherId`, `taskId`, `studentId`, `score`
  and `feedback` as **query parameters**, not a JSON body — the grading
  modal in the Teacher console reflects that.
