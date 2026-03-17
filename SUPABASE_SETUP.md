# 🚀 מדריך התקנת Supabase - צעד אחר צעד

## ✅ מה עשינו עד עכשיו:
- [x] התקנו את החבילות (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] יצרנו קבצי client (`app/lib/supabase/client.ts`, `server.ts`)
- [x] יצרנו טיפוסים (`app/types/session.type.ts`)
- [x] הוספנו משתנים ל-`.env`

---

## 📋 מה אתה צריך לעשות עכשיו:

### שלב 1: יצירת פרויקט ב-Supabase (5 דקות)

1. **לך ל-[supabase.com](https://supabase.com)**
2. **לחץ "Start your project"**
3. **התחבר עם GitHub** (או Email)
4. **לחץ "New Project"**
5. **מלא את הפרטים:**
   - Name: `branding-project`
   - Database Password: **שמור אותו במקום בטוח!**
   - Region: `Europe West` (או הכי קרוב אליך)
6. **לחץ "Create new project"**
7. ⏳ **חכה 2-3 דקות** שהפרויקט ייבנה

---

### שלב 2: יצירת הטבלאות (10 דקות)

1. **בתפריט השמאלי → לחץ "SQL Editor"**
2. **לחץ "New query"**
3. **העתק והדבק את הקוד הזה:**

\`\`\`sql
-- טבלת Sessions (השאלונים)
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  status text default 'in_progress',
  current_section text,
  
  -- כל התשובות בפורמט JSON
  sections jsonb default '{}'::jsonb,
  
  -- הלוגו שנוצר
  logo_url text,
  logo_created_at timestamp with time zone
);

-- Indexes לביצועים
create index sessions_user_id_idx on sessions(user_id);
create index sessions_status_idx on sessions(status);
create index sessions_created_at_idx on sessions(created_at desc);

-- Row Level Security (אבטחה)
alter table sessions enable row level security;

-- Policy: משתמש רואה רק את ה-sessions שלו
create policy "Users can view own sessions"
  on sessions for select
  using (auth.uid() = user_id);

-- Policy: משתמש יכול ליצור sessions
create policy "Users can create sessions"
  on sessions for insert
  with check (auth.uid() = user_id);

-- Policy: משתמש יכול לעדכן את ה-sessions שלו
create policy "Users can update own sessions"
  on sessions for update
  using (auth.uid() = user_id);

-- Policy: משתמש יכול למחוק את ה-sessions שלו
create policy "Users can delete own sessions"
  on sessions for delete
  using (auth.uid() = user_id);
\`\`\`

4. **לחץ "Run"** (או Ctrl+Enter)
5. **אמור לראות:** "Success. No rows returned"

---

### שלב 3: הגדרת Authentication (5 דקות)

1. **בתפריט השמאלי → "Authentication" → "Providers"**
2. **ודא ש-"Email" מופעל** (enabled = ירוק)
3. **אופציונלי:** אפשר להוסיף Google/GitHub

---

### שלב 4: קבלת API Keys (2 דקות) ⚠️ חשוב!

1. **בתפריט השמאלי → "Project Settings" (גלגל שיניים למטה)**
2. **לחץ על "API"**
3. **תראה 2 טאבים:**
   - **"Publishable and secret API keys"** ← השתמש בזה! (מומלץ)
   - **"Legacy anon, service_role API keys"** ← ישן, אל תשתמש

4. **בטאב "Publishable and secret API keys":**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Publishable key**: מפתח שמתחיל ב-`sb_publishable_...`

5. **העתק אותם לקובץ `.env.local`:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxx
GEMINI_API_KEY=your-gemini-key-here
\`\`\`

⚠️ **חשוב:** 
- השתמש ב-`.env.local` (לא `.env`) כדי שהמפתחות יהיו מוגנים
- ה-Publishable key הוא המפתח החדש והמומלץ של Supabase
- אם אתה רואה רק Legacy keys, זה בסדר - הם עדיין עובדים

---

### שלב 5: בדיקה שהכל עובד (5 דקות)

1. **הפעל את הפרויקט:**
\`\`\`bash
npm run dev
\`\`\`

2. **פתח את ה-console בדפדפן** (F12)

3. **הרץ את הקוד הזה ב-console:**
\`\`\`javascript
// בדיקה שהחיבור עובד
fetch('/api/test-supabase')
  .then(r => r.json())
  .then(console.log)
\`\`\`

4. **אמור לראות:** `{ success: true, message: "Supabase connected!" }`

---

## 🎯 מה הלאה?

אחרי שתסיים את כל השלבים למעלה, תגיד לי ואני:
1. ✅ אוסיף דפי Login/Signup
2. ✅ אחבר את שמירת ה-sessions
3. ✅ אוסיף "My Sessions" page
4. ✅ אחבר את יצירת הלוגו

---

## 🆘 בעיות נפוצות:

### "Invalid API key"
- ודא שהעתקת את המפתחות הנכונים
- ודא שאין רווחים בהתחלה/סוף
- הפעל מחדש את `npm run dev`

### "relation does not exist"
- ודא שהרצת את ה-SQL בשלב 2
- בדוק ב-"Table Editor" שהטבלה `sessions` קיימת

### "Row Level Security"
- ודא שהרצת את כל ה-policies בשלב 2
- בדוק ב-"Authentication" → "Policies" שהן קיימות

---

## 📞 צריך עזרה?

תגיד לי באיזה שלב אתה ואני אעזור!
