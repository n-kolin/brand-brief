# API Layer - שכבת API

תיקייה זו מכילה את כל הפונקציות לקריאות API בצורה מסודרת ונקייה.

## 📁 מבנה הקבצים

```
app/lib/api/
├── index.ts           # ייצוא מרכזי - import מכאן
├── endpoints.ts       # כל ה-URLs במקום אחד
├── questionsApi.ts    # פונקציות ליצירת שאלות
└── imageApi.ts        # פונקציות ליצירת תמונות
```

## 🎯 איך להשתמש

### ייבוא פשוט:
```typescript
import { generateQuestions, generateImage, API_ENDPOINTS } from '@/app/lib/api';
```

### דוגמה - יצירת שאלות:
```typescript
const data = await generateQuestions(sectionTitle, answeredQuestions);

if (data.success) {
  if (data.questions?.shouldContinue) {
    // יש שאלות חדשות
    addQuestions(data.questions.questions);
  } else {
    // AI החליט להפסיק
    console.log(data.questions?.reason);
  }
}
```

### דוגמה - יצירת תמונה:
```typescript
const data = await generateImage(allAnswers);

if (data.success) {
  // הצג את התמונה
  const imageUrl = `data:${data.mimeType};base64,${data.imageData}`;
}
```

## 🔧 הוספת API חדש

1. צור קובץ חדש: `myApi.ts`
2. הגדר את הפונקציות והטיפוסים
3. ייצא דרך `index.ts`

```typescript
// myApi.ts
export async function myApiFunction(params: any) {
  const response = await fetch(API_ENDPOINTS.MY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
}

// index.ts
export { myApiFunction } from './myApi';
```

## ✨ יתרונות

- **קוד נקי**: לא כותבים fetch בכל מקום
- **ניהול שגיאות**: טיפול מרכזי בשגיאות
- **TypeScript**: טיפוסים מלאים לכל פונקציה
- **תחזוקה קלה**: שינוי במקום אחד משפיע על כל הפרויקט
