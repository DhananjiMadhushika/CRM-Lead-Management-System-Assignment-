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
git clone <your-repo-url>
cd lead-management-crm
```

### 2. Backend Setup

```bash
cd backend

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
```

```bash
# Initialize the database
npx prisma generate
npx prisma db push

# Optional: Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/crm_db` |
| `JWT_SECRET` | Secret key for JWT signing | `a1b2c3d4e5f6g7h8i9j0` |
| `PORT` | Server port number | `5000` |

### Frontend
The frontend uses a hardcoded API URL (`http://localhost:5000`). For production, update all Axios calls to use an environment variable:

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

### Sample Data Seeding

Create a seed script (`backend/prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashSync('admin123', 10),
      role: 'admin',
    },
  });

  // Create salesperson
  const sales = await prisma.user.create({
    data: {
      name: 'John Sales',
      email: 'sales@crm.com',
      password: hashSync('sales123', 10),
      role: 'salesperson',
    },
  });

  // Create sample leads
  await prisma.lead.createMany({
    data: [
      {
        name: 'Alice Johnson',
        company: 'Tech Corp',
        email: 'alice@techcorp.com',
        phone: '+1-555-0101',
        status: 'NEW',
        source: 'WEBSITE',
        dealValue: 25000,
        priority: 'HIGH',
        assignedToId: sales.id,
      },
      {
        name: 'Bob Smith',
        company: 'Startup Inc',
        email: 'bob@startup.com',
        phone: '+1-555-0102',
        status: 'CONTACTED',
        source: 'LINKEDIN',
        dealValue: 15000,
        priority: 'MEDIUM',
        assignedToId: sales.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed: `npx tsx prisma/seed.ts`

## ⚠️ Known Limitations

### 1. Security
- **No refresh tokens**: JWT tokens don't expire or refresh automatically
- **Client-side storage**: Auth tokens stored in sessionStorage (vulnerable to XSS)
- **CORS**: Currently allows all origins (needs restriction for production)
- **No rate limiting**: API endpoints vulnerable to brute force attacks
- **Password requirements**: Minimal validation (only 8 char minimum)

### 2. Functionality
- **No email notifications**: Lead assignments and status changes don't trigger emails
- **No file uploads**: Cannot attach documents or images to leads
- **No activity logging**: Lead changes aren't tracked in an audit trail
- **No export feature**: Cannot export lead data to CSV/Excel
- **No bulk operations**: Cannot update or delete multiple leads at once
- **Limited search**: Search is case-sensitive and doesn't support fuzzy matching
- **No real-time updates**: Dashboard stats don't update without page refresh

### 3. UI/UX
- **No dark mode**: Only light theme available
- **Limited mobile optimization**: Some forms could be more touch-friendly
- **No keyboard shortcuts**: Navigation relies entirely on mouse/touch
- **No undo functionality**: Deleted leads/notes cannot be recovered
- **Basic error messages**: Error handling could be more user-friendly

### 4. Performance
- **No pagination optimization**: All leads loaded per page (could be slow with 1000+ leads)
- **No caching**: API responses not cached on frontend
- **No lazy loading**: All components load upfront
- **N+1 queries**: Some endpoints could be optimized with better Prisma includes

### 5. Data Integrity
- **No cascading delete protection**: Deleting a user doesn't handle their assigned leads gracefully
- **No data validation**: Limited client-side validation before API calls
- **No conflict resolution**: Multiple users can edit the same lead simultaneously

### 6. Deployment
- **No Docker setup**: Manual deployment required
- **No CI/CD pipeline**: No automated testing or deployment
- **Environment-specific configs**: Hardcoded localhost URLs
- **No health check endpoints**: Can't monitor API status

