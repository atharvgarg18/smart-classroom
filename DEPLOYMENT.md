# Smart Classroom - Dual Portal Deployment Guide

## Project Structure

Your project now has **two separate portals** that can be deployed independently:

### 1. **Admin/Teacher Portal** (Main)
- **Location**: `client/` folder
- **Entry Point**: `index-admin.html`
- **Build Output**: `dist/admin/`
- **URL**: Will be your main domain (e.g., `admin.smartclassroom.com` or `smartclassroom.com`)

### 2. **Student Portal**
- **Location**: `client-student/` folder
- **Entry Point**: `index-student.html`
- **Build Output**: `dist/student/`
- **URL**: Will be a separate deployment (e.g., `student.smartclassroom.com`)

### Shared Resources
- **UI Components**: `shared-ui/` - Shared components, hooks, utilities, and styles
- **Types & API**: `shared/` - TypeScript types and API interfaces
- **Backend**: `server/` - Express API (shared by both portals)

---

## Development

### Run Admin Portal (Port 8080)
```bash
pnpm dev:admin
```
Access at: `http://localhost:8080`

### Run Student Portal (Port 8081)
```bash
pnpm dev:student
```
Access at: `http://localhost:8081`

### Run Both Simultaneously
Open two terminals:
- Terminal 1: `pnpm dev:admin`
- Terminal 2: `pnpm dev:student`

---

## Building for Production

### Build All
```bash
pnpm build
```
This builds:
- Admin portal → `dist/admin/`
- Student portal → `dist/student/`
- Server → `dist/server/`

### Build Individual Portals
```bash
pnpm build:admin    # Only admin portal
pnpm build:student  # Only student portal
```

---

## Deployment on Netlify

### **Option 1: Deploy Student Portal (Recommended Path for You)**

#### For the Student Portal deployment:

1. **In Netlify Dashboard**:
   - Create a new site from your Git repository
   - Or use Netlify CLI: `netlify deploy`

2. **Build Settings**:
   - **Build command**: `pnpm build:student`
   - **Publish directory**: `dist/student`
   - **Base directory**: (leave empty or use `/`)

3. **Alternative: Use netlify-student.toml**:
   ```bash
   # Deploy using the student portal config
   netlify deploy --config=netlify-student.toml --prod
   ```

#### Path to Student Portal for Netlify:
- **Build Output Directory**: `dist/student`
- **Config File**: `netlify-student.toml`

---

### **Option 2: Deploy Admin Portal**

1. **Build Settings**:
   - **Build command**: `pnpm build:admin`
   - **Publish directory**: `dist/admin`

2. **Using default netlify.toml** (already configured):
   ```bash
   netlify deploy --prod
   ```

---

## Deployment Architecture

### Recommended Setup:

1. **Main Repository → Admin Portal**
   - Deploy from main branch
   - Domain: `admin.yourdomain.com` or `yourdomain.com`

2. **Same Repository → Student Portal**
   - Deploy from same repository but different Netlify site
   - Domain: `student.yourdomain.com` or `students.yourdomain.com`

### Why Two Deployments?
- **Independent scaling**: Student portal may need different resources
- **Separate domains**: Clear separation for users
- **Independent updates**: Deploy student portal updates without affecting admin
- **Simpler permissions**: Students don't have access to admin functionality

---

## File Structure Summary

```
smart-classroom/
├── client/                    # Admin/Teacher Portal
│   ├── App.tsx
│   ├── pages/
│   │   ├── Index.tsx         # Landing page (route selector)
│   │   ├── CommandCenter.tsx # Admin dashboard
│   │   └── Attendance.tsx    # Attendance page (also in admin)
│   └── components/
│       ├── dashboard/        # Admin-specific components
│       └── layout/           # Admin layout
│
├── client-student/           # Student Portal ⭐
│   ├── App.tsx              # Student app entry
│   ├── pages/
│   │   ├── Attendance.tsx   # Main student page
│   │   └── NotFound.tsx
│   └── components/
│       └── layout/          # Student layout
│
├── shared-ui/               # Shared UI Components
│   ├── components/
│   │   ├── ui/             # All Radix UI components
│   │   ├── theme-provider.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/
│   ├── lib/
│   └── global.css          # Shared styles & theme
│
├── shared/                  # Shared Types
│   ├── types.ts
│   └── api.ts
│
├── index-admin.html        # Admin entry point
├── index-student.html      # Student entry point ⭐
│
├── vite.config.admin.ts    # Admin build config
├── vite.config.student.ts  # Student build config ⭐
│
├── netlify.toml            # Default (Admin) deployment
└── netlify-student.toml    # Student portal deployment ⭐
```

---

## Quick Deploy Commands

### Student Portal to Netlify
```bash
# Build
pnpm build:student

# Deploy (manual)
cd dist/student
netlify deploy --prod

# Or use the config file
netlify deploy --config=netlify-student.toml --prod
```

### Admin Portal to Netlify
```bash
# Build
pnpm build:admin

# Deploy
netlify deploy --prod
```

---

## Important Notes

1. **Both portals share the same UI components** from `shared-ui/`
2. **Both portals can use the same backend API** (Express server in `server/`)
3. **Student portal is completely independent** - no landing page, goes directly to attendance
4. **Admin portal includes the landing page** with links to both sections
5. **Path aliases** are configured:
   - `@shared-ui/*` → Shared UI components
   - `@shared/*` → Shared types
   - `@/*` → Portal-specific files (client or client-student)

---

## Student Portal Path for Deployment

**The path you need for Netlify student portal deployment:**

📁 **`dist/student`**

This is generated when you run:
```bash
pnpm build:student
```

---

## Need Help?

- Admin portal runs on port `8080` in development
- Student portal runs on port `8081` in development  
- Both use the same Express API backend
- Check `netlify-student.toml` for student portal deployment config
