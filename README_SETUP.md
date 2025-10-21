# 🚀 ScentTwin Setup Guide for New Developers

## Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd scent-twin
npm install
```

### 2. Setup Environment Variables

**Copy the example environment file**:
```bash
# On Windows PowerShell
Copy-Item src/environments/environment.example.ts src/environments/environment.ts
Copy-Item src/environments/environment.example.ts src/environments/environment.prod.ts

# On Mac/Linux
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.prod.ts
```

### 3. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 4. Update Environment Files

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project.supabase.co',  // ← Paste your URL
    anonKey: 'eyJhbGc...',  // ← Paste your anon key
  },
  // ... rest of config
};
```

Edit `src/environments/environment.prod.ts` with the same values.

### 5. Apply Database Migrations

**Option A: Supabase Dashboard (Easiest)**

1. Go to [SQL Editor](https://app.supabase.com/project/_/sql)
2. Run `ALL_MIGRATIONS_COMBINED.sql`
3. Run `SEED_SAMPLE_PERFUMES.sql`

**Option B: Supabase CLI**

```bash
# Set your access token
$env:SUPABASE_ACCESS_TOKEN="your-token-from-dashboard"

# Link to project
npx supabase link --project-ref your-project-id

# Push migrations
npx supabase db push
```

### 6. Start Development Server

```bash
ng serve
```

Visit: http://localhost:4200

### 7. Test Connection

Go to: http://localhost:4200/welcome

Click **"🚀 Test Connection"** to verify:
- ✅ Supabase client initialized
- ✅ Auth system working
- ✅ Database connected (if migrations applied)

---

## 🔒 Security Notes

⚠️ **NEVER commit** your `environment.ts` or `environment.prod.ts` files!

These files are in `.gitignore` and should stay that way.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/           # Services, guards, models
│   ├── shared/         # Reusable components
│   └── features/       # Feature modules
├── assets/
│   └── styles/         # Global CSS
└── environments/
    ├── environment.example.ts  # ← Safe to commit
    ├── environment.ts          # ← DO NOT commit
    └── environment.prod.ts     # ← DO NOT commit
```

---

## 🧪 Running Tests

```bash
# Unit tests
ng test

# Build for production
ng build --configuration production
```

---

## 🆘 Troubleshooting

### "Invalid supabaseUrl" Error
- Check `environment.ts` has correct Supabase URL
- Make sure it starts with `https://`

### "Table does not exist" Error
- Apply database migrations (see Step 5)

### Changes not reflecting
- Restart `ng serve`
- Clear browser cache (Ctrl+Shift+R)

---

## 📚 Documentation

- [Full README](README.md)
- [Database Schema](DATABASE_SCHEMA_SUMMARY.md)
- [Security Guide](SECURITY_SETUP.md)
- [Implementation Details](IMPLEMENTATION_COMPLETE.md)

---

**Need help?** Check the docs above or open an issue!

