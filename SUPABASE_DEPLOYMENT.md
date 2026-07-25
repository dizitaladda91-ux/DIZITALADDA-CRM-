# Supabase + Render + Vercel deployment

1. Create a Supabase project, then open **Connect** in its dashboard. For this
   persistent Render backend, copy the **Session pooler** connection string
   (port `5432`). It works on IPv4 networks without the direct database
   endpoint's IPv6 requirement.
2. In Supabase **SQL Editor**, run [server/iem_lms.sql](server/iem_lms.sql)
   once. It creates the application tables and loads the current seed data.
3. Deploy the Render service with [render.yaml](render.yaml). In Render's
   Environment settings, set `DATABASE_URL` to the copied Supabase connection
   string and leave `DB_SSL=true`.
4. Deploy `frontend` as the Vercel project root. Set
   `VITE_API_URL=https://<render-service>.onrender.com/api` in Vercel.
5. After Vercel gives you its production URL, set Render's `CLIENT_URL` to that
   exact origin, such as `https://iem-lms.vercel.app`, and redeploy Render.

Do not place `DATABASE_URL`, Supabase passwords, or JWT secrets in source
files. Add them only in the Render dashboard. `VITE_API_URL` is safe to expose
because it is only the public API address.
