# MzansiRides — South African Car Rental Platform

A full-stack car rental web application built for the South African market. Browse vehicles, book rides with Paystack payments, manage fleets via an admin dashboard, and engage customers through automated email communications.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, AOS animations |
| **Backend** | Spring Boot 3.4, Java 21, Spring Security, JPA/Hibernate |
| **Database** | H2 (in-memory dev), production-ready for PostgreSQL/MySQL |
| **Auth** | JWT (role-based: Admin / User), BCrypt password hashing |
| **Email** | Spring Mail (Gmail SMTP), HTML email templates |
| **Payments** | Paystack inline integration |
| **Tooling** | Maven, ESLint, concurrently |

---

## Quick Start

### Prerequisites
- **Java 21** (JDK)
- **Maven** 3.9+
- **Node.js** 18+
- **Gmail account** with [App Password](https://myaccount.google.com/apppasswords) (for emails)

### 1. Clone & Install

```bash
git clone https://github.com/anomalyco/mzansirides.git
cd mzansirides
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Gmail credentials:

```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-16-char-app-password"
MAIL_FROM=your-email@gmail.com
ADMIN_JWT_SECRET=your-strong-secret-key
```

> **Note:** Without email config, the app still runs — emails fail silently.

### 3. Start

```bash
npm run dev:full
```

Wait for `Tomcat started on port 4000 (http)` in the logs (~15 seconds), then open:

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Client website |
| `http://localhost:5173/admin/login` | Admin portal |
| `http://localhost:4000/h2-console` | Database console |

### Default Admin Accounts

| Email | Password | Name |
|-------|----------|------|
| `n*******@gmail.com` | `Mzansi@2026` | ******** ******** N******* |
| `admin@mzansirides.co.za` | `Mzansi@2026` | MzansiRides Super Admin |

---

## Project Structure

```
MzansiRides/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/mzansirides/
│   │   ├── config/                   # Security, CORS, Web, DataSeeder
│   │   ├── controller/               # REST endpoints
│   │   ├── dto/                      # Request/response objects
│   │   ├── model/                    # JPA entities
│   │   ├── repository/              # Data access
│   │   ├── security/                # JWT util & auth filter
│   │   └── service/                 # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── src/                             # React frontend
│   ├── assets/                      # Images, data files
│   ├── components/                  # Reusable UI components
│   │   ├── Footer/  Header/  Layout/
│   │   └── UI/                      # Hero, HotDeals, Partners...
│   ├── pages/                       # Route pages
│   ├── routers/                     # React Router config
│   ├── styles/                      # CSS files
│   └── utils/                       # API helpers
├── .env.example                     # Environment template
├── .env                             # Local credentials (gitignored)
├── package.json                     # Frontend scripts
└── vite.config.js                   # Vite + proxy config
```

---

## Features

### Client Website

| Feature | Description |
|---------|-------------|
| **Browse Fleet** | Filter cars by category (Sedan, Hatchback, SUV, Luxury, Utility). Featured car detail section with image, price, status. |
| **Book a Ride** | Reservation form with date picker, time slots, add-ons (GPS, insurance, child seats). Paystack payment integration. |
| **User Accounts** | Register, login, email verification, forgot/reset password. Unverified users blocked from login. |
| **Newsletter** | Subscribe in footer. Automated welcome email. Unsubscribe link in every email. |
| **Become a Driver** | Submit driver application with contact details. Confirmation email sent. |
| **Contact Us** | Contact form with Google Maps embed. Messages saved to admin dashboard. |
| **Blog / FAQ** | Static content pages for customer education. |
| **Privacy Policy** | Terms and policies page. |

### Admin Dashboard (Separate Portal)

| Tab | Description |
|-----|-------------|
| **Dashboard** | Stats overview (bookings, cars, drivers, tickets). Booking geo-oversight. Operations checklist. Admin notes. |
| **Fleet** | Full CRUD for vehicles. **Upload car images** via file picker instead of URL. |
| **Bookings** | View, approve, cancel, complete bookings. |
| **Drivers** | Review, approve, or reject driver applications. |
| **Tickets** | View and resolve support tickets. |
| **Newsletter** | See subscriber count. Compose and send HTML newsletters to all active subscribers. |
| **Logout** | Clear admin session. |

### Email Automation

| Trigger | Email Sent |
|---------|-----------|
| User registers | Registration confirmation + verification link |
| Booking created | Booking confirmation with details |
| Driver application | Application received confirmation |
| Admin approves driver | Approval notification |
| Newsletter subscribe | Welcome email |
| Password reset request | Reset link (1 hour expiry) |
| Admin sends newsletter | Branded HTML to all subscribers |

All emails appear as **"MzansiRides"** as the sender name with branded dark-themed HTML templates.

### Security

- **JWT role-based auth** — Admin tokens (`ROLE_ADMIN`) cannot access user routes, user tokens cannot access admin routes
- **BCrypt password hashing** — All passwords hashed at rest
- **Email verification required** — Users must verify before login
- **SecureRandom tokens** — For verification and password reset
- **Admin-only uploads** — File upload endpoint requires admin authentication

---

## API Reference

### Public Endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/cars` | List all cars (optional `?category=`) |
| POST | `/api/public/bookings` | Create a booking |
| POST | `/api/public/drivers` | Submit driver application |
| POST | `/api/public/contact` | Submit contact message |
| POST | `/api/public/tickets` | Create support ticket |
| POST | `/api/public/subscribe` | Subscribe to newsletter |
| GET | `/api/public/unsubscribe?token=` | Unsubscribe from newsletter |
| GET | `/api/health` | Health check |

### Auth Endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login (requires verified email) |
| GET | `/api/auth/verify-email?token=` | Verify email address |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/profile` | Get user profile (requires auth) |

### Admin Endpoints (requires ADMIN role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/cars` | List all cars |
| POST | `/api/admin/cars` | Add new car |
| PUT | `/api/admin/cars/{id}` | Update car |
| DELETE | `/api/admin/cars/{id}` | Delete car |
| GET | `/api/admin/bookings` | List all bookings |
| PUT | `/api/admin/bookings/{id}/status` | Update booking status |
| DELETE | `/api/admin/bookings/{id}` | Delete booking |
| GET | `/api/admin/drivers` | List driver applications |
| PUT | `/api/admin/drivers/{id}/status` | Approve/reject driver |
| GET | `/api/admin/tickets` | List support tickets |
| PUT | `/api/admin/tickets/{id}/status` | Resolve ticket |
| GET | `/api/admin/subscribers` | List subscribers |
| GET | `/api/admin/subscribers/count` | Subscriber count |
| POST | `/api/admin/subscribers/send` | Send newsletter to all |
| POST | `/api/admin/upload/car-image` | Upload car image file |
| GET | `/api/admin/notes/latest` | Get latest admin note |
| POST | `/api/admin/notes` | Save admin note |
| GET | `/api/admin/contacts` | List contact messages |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite) |
| `npm run dev:api` | Start backend only (Spring Boot) |
| `npm run dev:full` | Start both concurrently |
| `npm run build` | Production build frontend |
| `npm run build:api` | Package backend JAR |
| `npm run lint` | ESLint check |

---

## Production Deployment

1. Update `application.properties`: switch H2 to PostgreSQL/MySQL, set `ddl-auto=validate`
2. Set strong `ADMIN_JWT_SECRET` in `.env`
3. Build frontend: `npm run build`
4. Build backend: `npm run build:api`
5. Serve frontend from Spring Boot static resources or a CDN
6. Configure SSL, rate limiting, and a proper database
7. Replace placeholder car images with real photos via admin dashboard

---

## License

Private — MzansiRides 2026. All rights reserved.
