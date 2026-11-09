# 🦃 Friendsgiving 2026 Potluck & RSVP Webpage

A responsive, festive web application for organizing **Friendsgiving 2026**! 

🌐 **Live URL**: [https://friendsgiving-2026-ebon.vercel.app](https://friendsgiving-2026-ebon.vercel.app)  
📦 **GitHub Repo**: [https://github.com/AriYB/2026-Friendsgiving-potluck](https://github.com/AriYB/2026-Friendsgiving-potluck)  
🗄️ **Supabase Project**: `friendsgiving-2026`

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-blue?logo=vercel)

---

## ✨ Features

- 🍁 **Festive Autumn UI**: Warm aesthetic, responsive layout, and countdown clock to feast day.
- 💌 **RSVP Management**:
  - Live guest counts (Attending, Maybe, Can't Make It).
  - Number of party members / plus-ones.
  - Optional contact info for event reminders.
- 🥗 **Potluck Dish Coordination**:
  - Categorized list: *Main Dishes*, *Side Dishes*, *Appetizers*, *Desserts*, *Drinks*, and *Supplies & Tableware*.
  - Track *Needed* vs. *Claimed* items with a live progress bar.
  - "I'll Bring This!" one-click claiming.
  - Ability to add custom dishes, servings, and dietary details.
- ⚠️ **Allergies & Dietary Restrictions Dashboard**:
  - Aggregated view of guest dietary needs (Gluten-Free, Vegetarian, Vegan, Nut Allergies, Dairy-Free, etc.).
  - Detailed notes for cooks to prevent cross-contamination and ensure everyone enjoys the meal safely.
- ⏰ **Day-Of Schedule & FAQ**:
  - Timeline of events (arrivals, dinner, toasts, games).
  - Parking, dress code, and serving utensil tips.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS
- **Database / Backend**: Supabase (PostgreSQL with Row Level Security)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AriYB/2026-Friendsgiving-potluck.git
cd 2026-Friendsgiving-potluck
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file with your Supabase credentials (see `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://okiekycmaffrbjvwpqih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

The database runs on Supabase with two main tables:

```sql
-- RSVPs Table
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
    guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 20),
    allergies TEXT DEFAULT '',
    dietary_tags TEXT[] DEFAULT '{}'::text[],
    notes TEXT DEFAULT ''
);

-- Potluck Items Table
CREATE TABLE public.potluck_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    category TEXT NOT NULL CHECK (category IN ('Appetizers', 'Main Dishes', 'Side Dishes', 'Desserts', 'Drinks', 'Supplies & Tableware')),
    item_name TEXT NOT NULL,
    servings INTEGER DEFAULT 6,
    dietary_notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'claimed' CHECK (status IN ('needed', 'claimed')),
    brought_by TEXT NOT NULL DEFAULT '',
    email TEXT DEFAULT '',
    rsvp_id UUID REFERENCES public.rsvps(id) ON DELETE SET NULL
);
```

---

## 🚢 Deploy to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select the `2026-Friendsgiving-potluck` repository.
3. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**!
