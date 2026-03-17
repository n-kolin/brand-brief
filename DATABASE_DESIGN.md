# 🗄️ תכנון Database - הסבר מפורט

## 🎯 המבנה הסופי:

```
┌─────────────────────────────────────────┐
│  auth.users (Supabase מטפל)            │
│  - id                                   │
│  - email                                │
└─────────────────────────────────────────┘
              │
              │ 1:N (משתמש → פרויקטים)
              ↓
┌─────────────────────────────────────────┐
│  projects (פרויקטים)                    │
│  - id                                   │
│  - user_id                              │
│  - name                                 │
│  - status                               │
│  - logo_url (לוגו אחד!)                 │
│  - logo_prompt                          │
│  - logo_created_at                      │
└─────────────────────────────────────────┘
              │
              │ 1:N (פרויקט → נושאים)
              ↓
┌─────────────────────────────────────────┐
│  sections (נושאים)                      │
│  - id                                   │
│  - project_id                           │
│  - section_key                          │
│  - title                                │
│  - questions (JSONB)                    │
│  - completed_at                         │
│  - ai_generation_rounds                 │
└─────────────────────────────────────────┘
```

---

## 📝 מבנה ה-questions (JSONB):

```json
[
  {
    "id": "q1",
    "type": "TEXT",
    "question": "What is your brand name?",
    "answer": "My Brand",
    "defaultAnswer": "",
    "isAiGenerated": false
  },
  {
    "id": "ai_q_123",
    "type": "RADIO",
    "question": "What style do you prefer?",
    "answer": "modern",
    "options": [
      { "key": "modern", "value": "Modern" },
      { "key": "classic", "value": "Classic" }
    ],
    "isAiGenerated": true
  }
]
```

---

## 🔄 תרחישי שימוש:

### 1. משתמש יוצר פרויקט חדש

```typescript
// 1. יצירת הפרויקט
const { data: project } = await supabase
  .from('projects')
  .insert({
    user_id: user.id,
    name: 'My Brand Logo'
  })
  .select()
  .single()

// 2. יצירת ה-sections
const sectionsToCreate = [
  {
    project_id: project.id,
    section_key: 'base-questions',
    title: 'Base Questions',
    questions: baseQuestions // מערך של QuestionType
  },
  {
    project_id: project.id,
    section_key: 'second-questions',
    title: 'Second Questions',
    questions: secondQuestions
  }
]

await supabase
  .from('sections')
  .insert(sectionsToCreate)
```

---

### 2. עדכון תשובות בנושא

```typescript
// עדכון השאלות של section מסוים
await supabase
  .from('sections')
  .update({
    questions: updatedQuestions,
    ai_generation_rounds: rounds + 1
  })
  .eq('project_id', projectId)
  .eq('section_key', 'base-questions')
```

---

### 3. קבלת פרויקט עם כל הנושאים

```typescript
// קבלת הפרויקט
const { data: project } = await supabase
  .from('projects')
  .select('*')
  .eq('id', projectId)
  .single()

// קבלת כל ה-sections
const { data: sections } = await supabase
  .from('sections')
  .select('*')
  .eq('project_id', projectId)
  .order('created_at')

// או בquery אחד:
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    sections (*)
  `)
  .eq('id', projectId)
  .single()
```

---

### 4. שמירת לוגו

```typescript
// עדכון הפרויקט עם הלוגו
await supabase
  .from('projects')
  .update({
    logo_url: imageUrl,
    logo_prompt: promptUsed,
    logo_created_at: new Date().toISOString(),
    status: 'completed'
  })
  .eq('id', projectId)
```

---

## ✅ יתרונות המבנה הזה:

### 1. **פשוט וברור**
- 2 טבלאות בלבד (+ auth.users)
- קל להבין את הקשרים

### 2. **גמיש**
- שאלות ב-JSONB → קל לשנות מבנה
- אפשר להוסיף sections בקלות

### 3. **יעיל**
- query אחד מביא section שלם
- לא צריך JOINs מסובכים

### 4. **מתאים לפרויקט**
- משתמש → פרויקטים → נושאים
- לוגו אחד לפרויקט (פשוט!)

---

## 🔒 אבטחה (RLS):

### Projects:
- משתמש רואה רק את הפרויקטים שלו
- משתמש יכול ליצור/עדכן/למחוק רק את שלו

### Sections:
- משתמש רואה sections רק מהפרויקטים שלו
- משתמש יכול לעדכן sections רק מהפרויקטים שלו

---

## 📊 דוגמת נתונים:

### projects:
```
id: "123e4567-e89b-12d3-a456-426614174000"
user_id: "user-uuid"
name: "My Startup Logo"
status: "in_progress"
logo_url: null
created_at: "2024-03-11T10:00:00Z"
```

### sections:
```
id: "section-uuid-1"
project_id: "123e4567-e89b-12d3-a456-426614174000"
section_key: "base-questions"
title: "Base Questions"
questions: [{ id: "q1", type: "TEXT", ... }, ...]
ai_generation_rounds: 2
created_at: "2024-03-11T10:01:00Z"
```

---

## 🚀 מה הלאה?

1. הרץ את `DATABASE_SCHEMA.sql` ב-Supabase
2. עדכן את הטיפוסים ב-TypeScript
3. צור API functions לעבודה עם הטבלאות
4. חבר את הקומפוננטות

---

**המבנה הזה פשוט, נקי, ויעיל!** 🎉
