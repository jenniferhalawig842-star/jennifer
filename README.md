# ☕ Velvet Roast — Full-Stack Coffee Shop App

A premium coffee shop web application built with **React + TypeScript**, **Node.js**, and **Supabase**.

---

## 🗂️ Project Structure

```
velvet-roast/
├── frontend/          # React + TypeScript (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route pages
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Supabase client, API utils
│       └── types/         # TypeScript interfaces
├── backend/           # Node.js + Express API
│   └── src/
│       ├── routes/        # API route handlers
│       ├── middleware/     # Auth, error handling
│       └── lib/           # Supabase admin client
└── README.md
```

---

## 🚀 Pages

| Page        | Path      | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| Homepage    | `/`       | Landing page with hero, featured, about, locations |
| Menu        | `/menu`   | Browse products by category, add to cart           |
| Buy         | `/buy`    | Checkout with customer info + Google Maps address  |
| Track Order | `/track`  | Track order status by order code                   |
| Login       | `/login`  | User authentication                                |
| Sign Up     | `/signup` | Create account                                     |
| Admin       | `/admin`  | Admin dashboard (admin only)                       |
| Staff       | `/staff`  | Staff order management (staff only)                |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + custom session management
- **Maps**: Google Maps API (address autocomplete)
- **Styling**: TailwindCSS + custom CSS variables
- **Icons**: Font Awesome 6
- **Fonts**: Cormorant Garamond, Outfit

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Google Maps API key (optional, for address autocomplete)

---

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** and run the following SQL:

```sql
-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin','staff','user')),
  date_registered TIMESTAMPTZ DEFAULT NOW(),
  password_needs_reset BOOLEAN DEFAULT false
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available','unavailable')),
  description TEXT,
  image_path TEXT,
  date_added TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  city TEXT,
  delivery_method TEXT DEFAULT 'pickup' CHECK (delivery_method IN ('pickup','delivery')),
  notes TEXT,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash','gcash')),
  total NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  ref_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','preparing','done','cancelled')),
  managed_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_img TEXT,
  size TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL
);

-- RLS Policies (disable for dev, enable for prod)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- For development: allow all (tighten in production)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- Seed admin user (password: admin123 — change immediately!)
INSERT INTO users (fullname, email, username, password, role)
VALUES ('Admin User', 'admin@velvetroast.com', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

3. Go to **Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon/public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

## 🖼️ Supabase Storage Setup (Required for Image Upload)

The Admin product image upload needs a **Supabase Storage bucket** to store files.

### Create the bucket (one-time setup)

1. In your Supabase project, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `product-images`
4. Toggle **Public bucket** to **ON** (so images are publicly viewable)
5. Click **Create bucket**

That's it! The upload button in Add Product will now work.

### Storage policy (run in SQL Editor if images return 403)

```sql
-- Allow public read access to product-images bucket
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow admins to upload
CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Allow admins to delete
CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
```

### How it works

- Admin picks a photo from their laptop (JPG/PNG/WebP, max 5 MB)
- The file is converted to base64 in the browser
- Sent to the backend `/api/products/upload-image` endpoint
- Backend uploads it to Supabase Storage
- Returns a permanent public URL stored in the `products.image_path` column

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
node -e "require('bcrypt').hash('velvetadmin123', 10).then(console.log)"
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

**.env**

```
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env
npm run dev
```

**.env**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_MAPS_KEY=your-google-maps-api-key
```

---

### 4. Running Both

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:4000

---

## 🔐 Default Credentials

| Role  | Username | Password |
| ----- | -------- | -------- |
| Admin | admin    | admin123 |

> ⚠️ Change the admin password immediately after first login!

---

## 📦 Key Dependencies

### Frontend

```json
{
  "react": "^18.3.0",
  "react-router-dom": "^6.x",
  "typescript": "^5.x",
  "@supabase/supabase-js": "^2.x",
  "tailwindcss": "^3.x",
  "axios": "^1.x"
}
```

### Backend

```json
{
  "express": "^4.x",
  "typescript": "^5.x",
  "@supabase/supabase-js": "^2.x",
  "bcrypt": "^5.x",
  "jsonwebtoken": "^9.x",
  "cors": "^2.x"
}
```

---

## 🗺️ Google Maps Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps JavaScript API** and **Places API**
3. Create an API key and add it to `VITE_GOOGLE_MAPS_KEY`

Without a key, the address field will still work as a plain text input.

---

## 📝 License

MIT — built for Velvet Roast Coffee Shop.
