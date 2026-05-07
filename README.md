# CRM Updates — Change Summary

## New Files

### Frontend
| File | Purpose |
|------|---------|
| `pages/LeadDetail.tsx` | Full lead detail view with integrated Notes (add/delete) |
| `pages/EditLead.tsx` | Edit lead form (pre-filled, includes priority field) |
| `pages/AddSalesperson.tsx` | Admin-only page to create salesperson or admin accounts |
| `pages/Settings.tsx` | Profile editing + password change for logged-in user |
| `pages/Leads.tsx` | ← REPLACED: now filters by assignedToId for salesperson role |
| `pages/AddLead.tsx` | ← REPLACED: fixed source enum + added priority field |
| `components/Menu.tsx` | ← REPLACED: role-based menu (admin sees "Add Member") |

### Backend
| File | Purpose |
|------|---------|
| `controllers/auth.ts` | Fixed: signup now accepts `role` field, returns user without password |
| `controllers/users.ts` | Added: `updateProfile` and `updatePassword` endpoints |
| `routes/auth.ts` | Fixed: signup now requires auth + admin middleware |
| `routes/users.ts` | Added: PATCH /:id/profile and PATCH /:id/password routes |
| `schema/leads.ts` | Fixed: source enum matches Prisma (COLD_EMAIL not COLD_CALL) |

---

## Bugs Fixed

### 1. Source enum mismatch
- **Problem**: Frontend used `COLD_CALL` and `EMAIL` but Prisma schema has `COLD_EMAIL` and `EVENT`
- **Fix**: Updated `SOURCE_OPTIONS` in AddLead, EditLead, Leads to match Prisma exactly

### 2. Signup not checking for `role` field
- **Problem**: `SignUpSchema` in old auth.ts didn't include `role`, so all created users defaulted to `salesperson`
- **Fix**: Updated schema to include `role: z.enum(["salesperson", "admin"]).default("salesperson")`

### 3. Self-registration was open
- **Problem**: `/api/auth/signup` was public — anyone could create accounts
- **Fix**: Signup route now requires `authMiddleware + adminMiddleware`

### 4. Login response exposed password hash
- **Problem**: `res.json({ user, token })` sent the bcrypt hash to the client
- **Fix**: Destructure and omit `password` before sending response

### 5. Notes were defined in schema but never used in UI
- **Fix**: `LeadDetail.tsx` now renders all notes, supports adding and deleting them

### 6. `priority` field missing from frontend forms
- **Problem**: `Lead` model has `priority` (LOW/MEDIUM/HIGH) but AddLead had no such field
- **Fix**: Added priority select to AddLead and EditLead forms

### 7. Salesperson sees all leads
- **Problem**: No role-based filtering on the Leads page
- **Fix**: If `user.role !== "admin"`, the leads query always passes `assignedToId = user.id`

---

## Routes to Add (see ROUTES_GUIDE.tsx)

```
/leads/:id         → LeadDetail
/leads/:id/edit    → EditLead
/team/new          → AddSalesperson (admin-only, wrapped in AdminRoute)
/settings          → Settings
```

Create an `AdminRoute` component that redirects non-admins to `/dashboard`:

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/Providers/AuthProvider";

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
export default AdminRoute;
```

---

## AuthProvider — Ensure `user` exposes `role`

Your `AuthProvider` must return the `role` field on the `user` object. 
Make sure your `/api/auth/me` endpoint returns `role`, and your context type includes it:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  role: string; // ← must be present
}
```

If your AuthProvider calls `/api/auth/me` on mount to hydrate the user, it will work automatically since the updated `me` controller returns the full user (without password).