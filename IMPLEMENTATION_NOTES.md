# הערות מימוש - יצירת שאלות דינמיות

## מה שונה?

### 1. **app/brand-brief/[id]/page.tsx**
הוספנו מנגנון Pre-generation חכם עם הגבלות:

```typescript
// מקסימום 3 סבבים של יצירת שאלות
const MAX_AI_GENERATION_ROUNDS = 3;

// כשנשארו 2 שאלות או פחות - מתחילים לייצר שאלות חדשות ברקע
const questionsLeft = questions.length - currentIndex - 1;
if (questionsLeft <= 2 && !isGeneratingRef.current) {
  generateQuestionsInBackground();
}
```

**איך זה עובד:**
- המשתמש עונה על שאלה → עובר מיד לשאלה הבאה (אין המתנה!)
- ברקע: אם נשארו 2 שאלות או פחות, המערכת מתחילה לייצר שאלות חדשות
- **הגבלת סבבים**: מקסימום 3 סבבים של יצירת שאלות (למנוע לולאה אינסופית)
- **AI מחליט**: ה-AI יכול להחליט שיש מספיק מידע ולהפסיק לייצר שאלות

**תוספות:**
- `isGenerating` state - מציג אינדיקטור "🤖 מכין שאלות נוספות..."
- `aiStoppedMessage` - מציג הודעה כשה-AI מחליט להפסיק
- `isGeneratingRef` - מונע קריאות כפולות ל-API
- `generationRoundsRef` - ספירת סבבי יצירה
- `generateQuestionsInBackground()` - פונקציה שמטפלת ביצירת השאלות

### 2. **app/lib/ai/prompts.ts**
שיפרנו את ה-prompt ל-AI:

**שינויים עיקריים:**
- שולח **זוגות שאלה-תשובה** במקום רק תשובות
- ה-AI מחליט אם להמשיך או להפסיק (`shouldContinue`)
- פורמט ברור עם `shouldContinue`, `reason`, `questions`

**דוגמה לתשובת AI:**
```json
{
  "shouldContinue": false,
  "reason": "יש מספיק מידע על סגנון העיצוב",
  "questions": []
}
```

או:
```json
{
  "shouldContinue": true,
  "questions": [...]
}
```

### 3. **app/lib/api/endpoints.ts** (חדש!)
קובץ מרכזי לכל ה-endpoints:

```typescript
export const API_ENDPOINTS = {
  GENERATE_QUESTIONS: '/api/gemini/generate-questions',
  GENERATE_IMAGE: '/api/gemini/generate-image',
  GEMINI_BASE: '/api/gemini',
} as const;
```

**יתרונות:**
- קוד נקי - לא כותבים URLs בתוך הקוד
- קל לשנות endpoints במקום אחד
- TypeScript safety

### 4. **app/api/gemini/generate-questions/route.ts**
תיקנו את משתנה הסביבה ועדכנו את הפורמט:
- `GOOGLE_GENAI_API_KEY` → `GEMINI_API_KEY`
- תמיכה ב-`shouldContinue` מה-AI
- החזרת פורמט אחיד

## איך לבדוק?

1. הרץ את השרת:
```bash
npm run dev
```

2. עבור ל: http://localhost:3000/brand-brief

3. התחל לענות על שאלות

4. שים לב:
   - אחרי שאלה 4 (כשנשארו 2 שאלות) - תראה "🤖 מכין שאלות נוספות..."
   - המשך לענות - השאלות החדשות יופיעו אוטומטית
   - אין המתנה בין שאלות!

## הגדרות שאפשר לשנות

בקובץ `app/brand-brief/[id]/page.tsx`:

```typescript
// שנה את המספר הזה כדי לקבוע מתי להתחיל לייצר שאלות
if (questionsLeft <= 2) { // ← שנה ל-3 או 1 לפי הצורך

// שנה את מספר הסבבים המקסימלי
const MAX_AI_GENERATION_ROUNDS = 3; // ← שנה ל-5 או 2 לפי הצורך
```

## מנגנוני עצירה

המערכת מפסיקה לייצר שאלות במקרים הבאים:

1. **הגבלת סבבים**: אחרי 3 סבבים של יצירת שאלות
2. **החלטת AI**: כשה-AI מחליט שיש מספיק מידע (`shouldContinue: false`)
3. **מעבר ל-Section הבא**: כשהמשתמש עובר לנושא הבא

## פורמט שאלה-תשובה

המערכת שולחת ל-AI זוגות מלאים:
```
Q: מה סגנון העיצוב שאתה מעדיף?
A: מינימליסטי

Q: אילו צבעים אתה אוהב?
A: כחול ולבן
```

במקום רק:
```
מינימליסטי
כחול ולבן
```

זה עוזר ל-AI להבין את ההקשר ולייצר שאלות רלוונטיות יותר.

## בעיות אפשריות

1. **השאלות לא נוצרות:**
   - בדוק שיש `GEMINI_API_KEY` ב-`.env`
   - בדוק את ה-console לשגיאות

2. **השאלות לא בפורמט נכון:**
   - ה-AI לפעמים מחזיר טקסט נוסף
   - הקוד מחפש JSON בתוך התשובה

3. **קריאות כפולות:**
   - השתמשנו ב-`useRef` כדי למנוע את זה
   - אם זה קורה, בדוק את ה-console

## מה הלאה?

- [ ] הוסף עיצוב יפה ל-loader
- [ ] הוסף אנימציה כשמוסיפים שאלות חדשות
- [ ] שמור את השאלות שנוצרו ב-localStorage
- [ ] הוסף retry logic אם ה-API נכשל
