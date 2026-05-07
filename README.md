# Lead Management CRM System

A full-stack Customer Relationship Management (CRM) application designed to help sales teams manage leads, track deals, and collaborate effectively through notes and pipeline management.

## 📋 Project Overview

This CRM system provides a comprehensive solution for managing the entire sales pipeline from initial lead capture through deal closure. Built with modern web technologies, it offers role-based access control, real-time analytics, and an intuitive interface for both salespeople and administrators.

The application addresses common pain points in sales operations:
- Centralized lead database with searchable and filterable views
- Pipeline visibility with status tracking and deal value calculations
- Team collaboration through contextual notes on each lead
- Performance insights via dashboard analytics
- Responsive design for desktop and mobile access

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Database modeling and migrations
- **MySQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken (JWT)** - Authentication tokens
- **Zod** - Runtime schema validation

### Frontend
- **React 18** with **TypeScript** - Component-based UI
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization (charts)
- **React Icons** - Icon library

### Development Tools
- **ESLint** & **Prettier** - Code quality
- **Nodemon** - Auto-restart server during development

## ✨ Features Implemented

### 1. Authentication & Authorization
- User registration and login with JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin and Salesperson roles)
- Protected routes and API endpoints
- Session management via sessionStorage

### 2. Dashboard Analytics
- **Key Metrics Cards**: Total leads, new leads, qualified, won, lost, and pipeline values
- **Pipeline Activity Chart**: Bar chart showing lead distribution by source
- **Status Breakdown**: Pie chart visualizing leads by current status
- **Recent Leads Table**: Last 5 leads added with quick navigation
- **Top Salespeople Leaderboard**: Rankings by won deal value

### 3. Lead Management
- **List View**: Paginated, filterable, searchable lead table
  - Filter by status, source, and assigned salesperson
  - Search across name, company, and email fields
  - Toggle between "All Leads" and "My Leads" views
- **Create Lead**: Form with validation for adding new leads
  - All standard fields: name, company, email, phone
  - Status, source, priority dropdowns
  - Deal value and assignment
- **View Lead Details**: Comprehensive lead profile page
  - Contact information and deal details
  - Status and priority badges
  - Timeline of notes with author and timestamp
- **Edit Lead**: Update any lead information
- **Delete Lead**: Remove leads with confirmation modal

### 4. Notes System
- Add contextual notes to any lead
- View full note history with timestamps
- Author attribution with user initials
- Delete own notes (or any note as admin)
- Real-time "time ago" formatting

### 5. User Management
- Add new team members (salespeople or admins)
- List all users for lead assignment dropdowns
- Update profile information (name, email)
- Change password functionality
- Delete user accounts (admin only)

### 6. Responsive Design
- Mobile-optimized layouts
- Touch-friendly interfaces
- Adaptive table columns (hide less critical info on mobile)
- Consistent design system with rounded corners and soft shadows

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/DhananjiMadhushika/CRM-Lead-Management-System-Assignment-.git
cd CRM-Lead-Management-System-Assignment-
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Create a .env file in the backend directory
```

**Required `.env` variables:**
```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/crm_db"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Port
PORT=5000

# Frontend URL
FRONTEND_URL= ""
```

```bash
# Initialize the database
npx prisma generate
npx prisma db push

# Optional: Seed the database with sample data
npm run seed

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd client

# Install dependencies
yarn add

# Start the development server
yarn run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

**Required `.env` variables:**
```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/crm_db"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Port
PORT=5000

# Frontend URL
FRONTEND_URL= ""
```


```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## 👤 Test Login Credentials

After running the database setup, you can create test accounts or use these if you've seeded the database:

### Admin Account
- **Email**: `admin@crm.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

### Salesperson Account
- **Email**: `sales@crm.com`
- **Password**: `sales123`
- **Role**: Salesperson (limited access)

You can also create new accounts via the signup endpoint or the "Add Team Member" page (requires admin access).

## 🗄️ Database Setup

### Using Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view/edit data
npx prisma studio
```

### Database Schema Overview

**Models:**
- `User` - System users (salespeople and admins)
- `Lead` - Sales leads with contact info and deal details
- `Note` - Comments/notes attached to leads

**Relationships:**
- User → Leads (one-to-many: one user can have many assigned leads)
- User → Notes (one-to-many: one user can create many notes)
- Lead → Notes (one-to-many: one lead can have many notes)

**Enums:**
- `LeadStatus`: NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, WON, LOST
- `LeadSource`: WEBSITE, LINKEDIN, REFERRAL, COLD_EMAIL, EVENT, OTHER
- `Priority`: LOW, MEDIUM, HIGH
