# מבנה התשובות מה-API - הסבר מפורט

## 🎯 הבעיה: שני דברים שונים בשם "questions"

יש **שני סוגים שונים** של אובייקטים עם שמות דומים:

---

## 1️⃣ QuestionType - שאלה בודדת

זה הטיפוס של **שאלה אחת** בשאלון:

```typescript
type QuestionType = {
  type: 'TEXT' | 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'NUMBER' | 'DATE';
  id: string;
  question: string;
  answer?: string | number | Date | string[];
  defaultAnswer?: string | number | Date;
  options?: { key: string, value: string, default?: boolean }[];
}
```

**דוגמה:**
```typescript
{
  type: 'TEXT',
  id: 'q1',
  question: 'מה שמך?',
  answer: 'דני',
  defaultAnswer: ''
}
```

---

## 2️⃣ GenerateQuestionsResponse - תשובה מה-API

זה מה שה-API **מחזיר** כשמבקשים שאלות חדשות:

```typescript
interface GenerateQuestionsResponse {
  success: boolean;
  questions?: {
    shouldContinue: boolean;    // ← האם להמשיך לייצר שאלות?
    reason?: string;             // ← למה? (אם shouldContinue = false)
    questions: QuestionType[];   // ← השאלות עצמן (מערך של QuestionType)
  };
}
```

**דוגמה 1 - AI רוצה להמשיך:**
```typescript
{
  success: true,
  questions: {
    shouldContinue: true,
    questions: [
      { type: 'TEXT', id: 'ai_q1', question: 'מה הצבע המועדף?', ... },
      { type: 'RADIO', id: 'ai_q2', question: 'איזה סגנון?', ... },
      { type: 'TEXT', id: 'ai_q3', question: 'מה התקציב?', ... }
    ]
  }
}
```

**דוגמה 2 - AI מחליט להפסיק:**
```typescript
{
  success: true,
  questions: {
    shouldContinue: false,
    reason: "יש מספיק מידע על הצבעים והסגנון",
    questions: []  // ← מערך ריק
  }
}
```

---

## 🔍 איך זה עובד בקוד?

### בקומפוננטה:
```typescript
const data = await generateQuestions(sectionTitle, answeredQuestions);

// data = GenerateQuestionsResponse
if (data.success) {
  // data.questions = { shouldContinue, reason?, questions: QuestionType[] }
  
  if (data.questions?.shouldContinue === false) {
    // AI אמר להפסיק
    console.log(data.questions.reason); // "יש מספיק מידע..."
  } else {
    // יש שאלות חדשות
    const newQuestions = data.questions.questions; // QuestionType[]
    addQuestions(newQuestions);
  }
}
```

---

## 📊 דיאגרמה:

```
GenerateQuestionsResponse
├── success: boolean
└── questions: {
    ├── shouldContinue: boolean
    ├── reason?: string
    └── questions: QuestionType[]  ← פה השאלות האמיתיות!
        ├── [0]: { type, id, question, ... }
        ├── [1]: { type, id, question, ... }
        └── [2]: { type, id, question, ... }
    }
```

---

## 🤔 למה ככה?

כי רצינו **שני דברים**:
1. **השאלות עצמן** (QuestionType[])
2. **מטא-דאטה** (האם להמשיך? למה?)

אפשר היה לעשות ככה:
```typescript
{
  success: true,
  shouldContinue: false,  // ← בשורש
  reason: "...",          // ← בשורש
  questions: QuestionType[]  // ← ישר מערך
}
```

אבל בחרנו לקבץ הכל תחת `questions` כדי שיהיה מאורגן יותר.

---

## 🐛 איך לדבג?

אם משהו לא עובד, בדוק ב-console:

```
🚀 Sending request to AI: { sectionTitle, ... }
📤 Calling API: /api/gemini/generate-questions
📋 Request data: { ... }
📡 Response status: 200 OK
✅ API Response: { success: true, questions: { ... } }
📥 Received response from AI: { ... }
✨ Adding 3 new questions
```

אם יש שגיאה תראה:
```
❌ Error in generate-questions route: ...
❌ HTTP Error: ...
```
