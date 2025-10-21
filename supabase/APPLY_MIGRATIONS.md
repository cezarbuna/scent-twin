# How to Apply Migrations to Supabase

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Get Your Access Token
1. Go to https://app.supabase.com/account/tokens
2. Generate a new access token
3. Copy the token

### Step 2: Login to Supabase CLI
```bash
npx supabase login
# Paste your access token when prompted
```

### Step 3: Link to Your Project
```bash
npx supabase link --project-ref kzgdpypsofeydsltvlaa
```

### Step 4: Push Migrations
```bash
npx supabase db push
```

This will apply all 11 migrations in order:
1. ✅ create_users_table.sql
2. ✅ create_user_profiles_table.sql
3. ✅ create_selfies_derived_table.sql
4. ✅ create_perfumes_table.sql
5. ✅ create_user_ratings_table.sql
6. ✅ create_wardrobes_table.sql
7. ✅ create_price_offers_table.sql
8. ✅ create_recommendations_history_table.sql
9. ✅ enable_rls_and_policies.sql
10. ✅ create_functions_and_triggers.sql
11. ✅ seed_sample_perfumes.sql

---

## Option 2: Using Environment Variable (Alternative)

```bash
# Set your access token as environment variable
$env:SUPABASE_ACCESS_TOKEN="your-access-token-here"

# Then run the commands
npx supabase link --project-ref kzgdpypsofeydsltvlaa
npx supabase db push
```

---

## Option 3: Manual Application via Supabase Dashboard

If you prefer to apply migrations manually:

1. Go to https://app.supabase.com/project/kzgdpypsofeydsltvlaa
2. Navigate to **SQL Editor**
3. Open each migration file from `supabase/migrations/` in order
4. Copy the SQL content
5. Paste into SQL Editor and click "Run"

Apply them in this exact order (important for dependencies):
1. `20241021000001_create_users_table.sql`
2. `20241021000002_create_user_profiles_table.sql`
3. `20241021000003_create_selfies_derived_table.sql`
4. `20241021000004_create_perfumes_table.sql`
5. `20241021000005_create_user_ratings_table.sql`
6. `20241021000006_create_wardrobes_table.sql`
7. `20241021000007_create_price_offers_table.sql`
8. `20241021000008_create_recommendations_history_table.sql`
9. `20241021000009_enable_rls_and_policies.sql`
10. `20241021000010_create_functions_and_triggers.sql`
11. `20241021000011_seed_sample_perfumes.sql`

---

## Verification

After applying migrations, verify in Supabase Dashboard:

### Check Tables (8 tables)
- ✅ public.users
- ✅ public.user_profiles
- ✅ public.selfies_derived
- ✅ public.perfumes (with 15 sample perfumes)
- ✅ public.user_ratings
- ✅ public.wardrobes
- ✅ public.price_offers
- ✅ public.recommendations_history

### Check RLS Policies (10+ policies)
- Go to **Authentication** → **Policies**
- Verify each table has RLS enabled
- Check that user-data tables have appropriate policies

### Check Functions
- Go to **Database** → **Functions**
- Verify:
  - ✅ update_updated_at_column()
  - ✅ handle_new_user()
  - ✅ calculate_overall_rating()
  - ✅ get_weekly_free_reveals()
  - ✅ has_completed_quiz()

### Check Triggers
- Go to **Database** → **Triggers**
- Verify triggers on:
  - ✅ auth.users (on_auth_user_created)
  - ✅ All tables with updated_at timestamps

### Check Sample Data
- Go to **Table Editor** → **perfumes**
- Should see 15 sample perfumes (mix of designer and niche)

---

## Troubleshooting

### Error: "relation already exists"
- Tables already exist. Either drop and recreate, or skip that migration.

### Error: "permission denied"
- Make sure you're using a service role key or owner account.

### Error: "function does not exist"
- Run function migrations before trigger migrations.

### RLS blocking queries
- Check policies are correctly configured for `auth.uid()`.
- Verify user is authenticated when testing.

---

## Next Steps After Migrations

1. **Generate TypeScript Types**:
   ```bash
   npx supabase gen types typescript --linked > src/app/core/models/database.types.ts
   ```

2. **Update Environment Files**:
   - Environment files already configured with Supabase credentials

3. **Test Authentication**:
   - Try signing up a user
   - Verify `users` table auto-populates via trigger

4. **Test Queries**:
   - Query perfumes (public access)
   - Try creating a user profile (requires auth)
   - Test RLS policies

