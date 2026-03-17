# ⚡ התחלה מהירה - Supabase Setup

## 🎯 מה צריך לעשות עכשיו (20 דקות):

### 1️⃣ צור פרויקט ב-Supabase
- לך ל-[supabase.com](https://supabase.com)
- צור פרויקט חדש
- שמור את ה-Database Password!

### 2️⃣ צור את הטבלה
- SQL Editor → New query
- העתק את ה-SQL מ-`SUPABASE_SETUP.md` (שלב 2)
- Run

### 3️⃣ קבל את המפתחות
- Project Settings → API
- העתק:
  - Project URL
  - anon public key

### 4️⃣ עדכן את `.env`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5️⃣ בדוק שעובד
```bash
npm run dev
```

פתח: http://localhost:3000/api/test-supabase

אמור לראות:
```json
{
  "success": true,
  "message": "Supabase connected successfully!"
}
```

---

## ✅ אחרי שזה עובד - תגיד לי!

ואני אוסיף:
1. Login/Signup pages
2. Session management
3. Logo storage

---

## 📖 מדריך מפורט

ראה `SUPABASE_SETUP.md` להסבר מלא צעד אחר צעד.
