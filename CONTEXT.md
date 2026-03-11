כדי לנהל את השאלות בצורה דינמית ומתמשכת, תוך שמירה על חוויית משתמש טובה וללא צורך בלולאות מסורבלות, ניתן לעצב את המערכת כך שתתמוך בהוספה דינמית של שאלות למערך השאלות הקיים. הנה איך ניתן לעשות זאת בצורה מסודרת:

---

## **תכנון הפתרון**

1. **שאלות בסיסיות (Initial Questions):**
   - כל `Section` יתחיל עם מערך של שאלות בסיסיות שייטענו מיד עם טעינת העמוד.
   - השאלות הבסיסיות יוגדרו מראש בקובץ הקונפיגורציה (`questions.config.ts`).

2. **שאלות דינמיות:**
   - השאלות הדינמיות ייווצרו על ידי ה-AI בהתבסס על התשובות לשאלות הקודמות.
   - השאלות יתווספו למערך השאלות הקיים באמצעות פונקציה `addQuestions`.

3. **פונקציה להוספת שאלות:**
   - פונקציה שתוסיף שאלות למערך השאלות הקיים.
   - הפונקציה תוודא שהשאלות החדשות מתווסxxx בצורה מסודרת למערך.

4. **מעבר בין שאלות:**
   - נשתמש במצב (`state`) כדי לעקוב אחרי השאלה הנוכחית.
   - בכל פעם שמשתמש עונה על שאלה, נבדוק אם יש צורך להוסיף שאלות חדשות למערך.

5. **טעינה דינמית של שאלות:**
   - נשתמש ב-`useEffect` כדי להאזין לשינויים בתשובות המשתמש ולהפעיל את ה-AI ליצירת שאלות חדשות במידת הצורך.

---

## **מימוש הפתרון**

### **1. פונקציה להוספת שאלות**
ניצור פונקציה שתוסיף שאלות למערך הקיים:

```typescript
const addQuestions = (newQuestions: QuestionType[]) => {
  setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
};
```

---

### **2. פונקציה ליצירת שאלות באמצעות AI**
נשתמש ב-AI כדי לייצר שאלות חדשות על בסיס התשובות הקיימות:

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function generateQuestionsBasedOnAnswers(answers: AnswerType[]): Promise<QuestionType[]> {
  try {
    // שליחת בקשה ל-AI ליצירת שאלות
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate follow-up questions based on these answers: ${JSON.stringify(answers)}`,
    });

    // נניח שה-AI מחזיר רשימה של שאלות בפורמט JSON
    const generatedQuestions: QuestionType[] = JSON.parse(response.text);

    return generatedQuestions;
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
```

---

### **3. עדכון הקומפוננטה `page.tsx`**
נעדכן את הקומפוננטה כך שתתמוך בטעינה דינמית של שאלות:

```tsx
export default function page() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id;
  const sectionKeys = Object.keys(Sections);
  const currentSectionIndex = sectionKeys.findIndex(key => Sections[key as keyof typeof Sections].id === sectionId);

  if (currentSectionIndex === -1) {
    notFound();
    return null;
  }

  const currentQuestions = allQuestions.find(sec => sec.id === sectionId);

  const initialQuestions = currentQuestions?.questions || [];
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleAnswer = async (answer: AnswerType, index: number) => {
    const updatedQuestions = [...questions];

    updatedQuestions[index] = {
      ...updatedQuestions[index],
      answer,
    };
    setQuestions(updatedQuestions);

    // בדוק אם צריך לייצר שאלות חדשות
    if (index === questions.length - 1) {
      const newQuestions = await generateQuestionsBasedOnAnswers(
        updatedQuestions.map((q) => q.answer)
      );
      addQuestions(newQuestions);
    }

    // עדכון אינדקס השאלה הנוכחית
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const addQuestions = (newQuestions: QuestionType[]) => {
    setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
  };

  const handleNextSection = () => {
    if (currentSectionIndex + 1 < sectionKeys.length) {
      const nextSectionId = Sections[sectionKeys[currentSectionIndex + 1] as keyof typeof Sections].id;
      router.push(`/brand-brief/${nextSectionId}`);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevSectionId = Sections[sectionKeys[currentSectionIndex - 1] as keyof typeof Sections].id;
      router.push(`/brand-brief/${prevSectionId}`);
    }
  };

  return (
    <div>
      <h1>Section {sectionId}</h1>
      <h2>{currentQuestions?.title}</h2>
      <div>
        {
          questions.slice(0, currentIndex).map((q, idx) => (
            <HistoryQuestionCard key={q.id} question={q}></HistoryQuestionCard>
          ))
        }
        <QuestionCard
          question={questions[currentIndex]}
          initialValue={questions[currentIndex]?.answer || questions[currentIndex]?.defaultAnswer || ''}
          onAnswer={(answer: AnswerType) =>
            handleAnswer(answer, currentIndex)
          }
        />
        <h2>
          Answer: {questions[currentIndex]?.answer || 'No answer yet'}
        </h2>
      </div>

      <div>
        <button onClick={handlePrevSection} disabled={currentSectionIndex === 0}>Previous Section</button>
        <button onClick={handleNextSection} disabled={currentSectionIndex + 1 >= sectionKeys.length}>Next Section</button>
      </div>
    </div>
  );
}
```

---

### **4. איך זה עובד?**
1. **שאלות בסיסיות:**  
   השאלות הבסיסיות נטענות מיד עם טעינת העמוד מתוך הקובץ `questions.config.ts`.

2. **הוספת שאלות דינמיות:**  
   כאשר המשתמש עונה על שאלה, הפונקציה `handleAnswer` בודקת אם המשתמש הגיע לשאלה האחרונה במערך. אם כן, היא מפעילה את הפונקציה `generateQuestionsBasedOnAnswers` כדי לייצר שאלות חדשות על בסיס התשובות הקיימות.

3. **עדכון המערך:**  
   השאלות החדשות שנוצרו על ידי ה-AI מתווסxxx למערך השאלות באמצעות הפונקציה `addQuestions`.

4. **מעבר בין שאלות:**  
   המערכת משתמשת במצב (`state`) כדי לעקוב אחרי השאלה הנוכחית. בכל פעם שמשתמש עונה על שאלה, המערכת עוברת לשאלה הבאה במערך.

---

### **יתרונות הגישה:**
1. **דינמיות:**  
   המערכת יכולה להוסיף שאלות חדשות בזמן אמת, בהתאם לתשובות המשתמש.

2. **שיפור חוויית המשתמש:**  
   שאלות הבסיס נטענות מיד, והשאלות הדינמיות נטענות רק כשצריך, מה שמונע טעינה ארוכה בהתחלה.

3. **פשטות:**  
   אין צורך בלולאות מסובכות. המערכת עובדת על מערך שאלות שמתעדכן בזמן אמת.

4. **גמישות:**  
   ניתן לשנות את אופן יצירת השאלות הדינמיות (לדוגמה, להוסיף לוגיקה מורכבת יותר) מבלי לשנות את מבנה הקוד הבסיסי.

---

### **שיקולים נוספים:**
1. **שימוש ב-Loader בזמן יצירת שאלות:**  
   הוסף אינדיקציה למשתמש שהשאלות החדשות נטענות (לדוגמה, ספינר).

2. **שמירת השאלות:**  
   אם תרצה לשמור את השאלות שנוצרו על ידי ה-AI, תוכל לשלוח אותן לשרת או לשמור אותן בבסיס נתונים.

3. **ניהול שגיאות:**  
   אם ה-AI לא מצליח לייצר שאלות (לדוגמה, בעיית רשת), הצג הודעת שגיאה למשתמש.

אם יש לך שאלות נוספות או אם תרצה עזרה בכתיבת הקוד, אני כאן!