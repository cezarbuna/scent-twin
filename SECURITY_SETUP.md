# 🔒 Security Setup for ScentTwin

## ⚠️ Important: Never Commit Secrets to Git

Your Supabase credentials are currently in the codebase. Before pushing to GitHub:

### Step 1: Remove Secrets from Git History

```bash
# If you haven't committed yet, you're good!
# If you have, remove the environment files from tracking:
git rm --cached src/environments/environment.ts
git rm --cached src/environments/environment.prod.ts
git commit -m "Remove environment files with secrets"
```

### Step 2: Verify .gitignore

The following files are now in `.gitignore`:
- ✅ `src/environments/environment.ts`
- ✅ `src/environments/environment.prod.ts`
- ✅ `.env` files

### Step 3: Use Example Files for Setup

We've created `environment.example.ts` that shows the structure WITHOUT real credentials:

```typescript
// src/environments/environment.example.ts
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
  // ... other config
};
```

### Step 4: Team Setup Instructions

When a new developer clones the repo:

1. **Copy the example file**:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

2. **Fill in real credentials** (from Supabase dashboard)

3. **Never commit** these files (already in .gitignore)

---

## 🛡️ Security Model

### Supabase Anon Key: Is it Safe?

The `anonKey` is designed to be "public" because:
- ✅ It's used in client-side code (browsers)
- ✅ Protected by Row Level Security (RLS) policies
- ✅ Users can only access data allowed by RLS

**However**, you should still keep it out of public repos because:
- ❌ Prevents abuse/spam from bots
- ❌ Avoids rate limit issues
- ❌ Prevents unauthorized API calls (even if they're blocked by RLS, they consume resources)

### What About the Service Role Key?

**NEVER** expose the `service_role` key in client code:
- ❌ It bypasses all RLS policies
- ❌ Full database access
- ❌ Only use on backend/server-side

---

## 🔐 Current Protection Status

### What's Protected (✅)

1. **Row Level Security (RLS)** - All tables have policies
2. **User Data Isolation** - Users can only access their own data
3. **Public Catalog** - Perfumes and prices are intentionally public
4. **Auth Required** - Most features need authentication

### What You Need to Do (⚠️)

1. ✅ **Add secrets to .gitignore** - DONE
2. ⚠️ **Remove from git history** (if already committed)
3. ⚠️ **Use environment variables** in production
4. ⚠️ **Set up CI/CD secrets** (GitHub Actions, Vercel, etc.)

---

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

### Option 1: Platform Environment Variables (Recommended)

**Vercel**:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

**Netlify**:
- Go to Site Settings → Environment Variables
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Option 2: Build-time Variables

Update `angular.json` to use environment variables:

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    }
  }
}
```

---

## 📝 Checklist Before Pushing to GitHub

- [ ] Secrets are in `.gitignore`
- [ ] `environment.example.ts` exists (without real credentials)
- [ ] README includes setup instructions
- [ ] No secrets in git history
- [ ] Service role key is NEVER in client code

---

## 🆘 If You Accidentally Committed Secrets

### Option 1: If Not Pushed Yet
```bash
# Remove from staging
git reset HEAD src/environments/environment.ts

# Undo local changes
git checkout -- src/environments/environment.ts
```

### Option 2: If Already Pushed to GitHub

1. **Rotate your keys immediately**:
   - Go to Supabase Dashboard → Settings → API
   - Click "Reset anon key" (generates new key)
   - Update your local environment files

2. **Remove from git history**:
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/environments/environment.ts" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (be careful!)
   git push origin --force --all
   ```

3. **Inform Supabase** (for audit trail)

---

## 🎯 Best Practices Summary

✅ **DO**:
- Use `.gitignore` for environment files
- Use example files to show structure
- Store secrets in CI/CD platform variables
- Enable RLS on all user tables
- Rotate keys if exposed

❌ **DON'T**:
- Commit `.env` or `environment.ts` files
- Use `service_role` key in client code
- Share keys in Slack/Discord/email
- Hard-code credentials anywhere

---

## 📚 Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Angular Environment Variables](https://angular.io/guide/build)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**🔒 Security is a continuous process, not a one-time setup!**

