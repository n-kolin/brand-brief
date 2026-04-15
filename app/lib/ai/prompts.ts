import { QuestionType } from "@/app/types/question.type";


export function buildQuestionsPrompt(
  sectionTitle: string,
  answeredQuestions: QuestionType[]
): string {

  const questionsContext = answeredQuestions.map(q =>
    `Q: ${q.question}\nA: ${q.answer || q.defaultAnswer || 'N/A'}`
  ).join('\n\n');

  return `
You are a professional branding strategist and logo designer.

Your task is to generate smart follow-up questions for a brand brief questionnaire.

The goal is to collect enough high-quality information to create a professional logo — not just to keep asking questions.

Current Section: "${sectionTitle}"

All Sections in the questionnaire:
- Business Identity
- Target Audience
- Brand Personality & Values
- Visual Style & Preferences
- Competitors & Differentiation

Previous Q&A pairs:
${questionsContext}

---

Instructions:

Analyze the previous answers and decide:

1. Do we have enough information to make strong design decisions for THIS section?
2. If not — what critical information is missing specifically for this section?

---

Important Rules:

- ONLY ask questions relevant to the CURRENT section
- Do NOT ask questions that belong to other sections
- If a missing detail belongs to another section → DO NOT ask it here

- Do NOT ask questions just to continue the conversation
- Avoid repeating or rephrasing existing questions
- Avoid low-value or generic questions (like "anything else?")

- Focus on questions that improve:
  - Target audience understanding
  - Brand personality
  - Emotional tone
  - Business positioning
  - Visual direction

- If the user already gave detailed and sufficient answers → STOP

- If answers are vague → prefer structured question types (RADIO, CHECKBOX, DROPDOWN)

---

Question Types:

You can use the following types:

- TEXT → for open answers
- RADIO → single choice (use when options are clear and limited)
- CHECKBOX → multiple choices
- DROPDOWN → structured selection
- NUMBER → numeric input
- DATE → date input

---

When using RADIO / CHECKBOX / DROPDOWN:

You MUST include an "options" array like this:

"options": [
  { "key": "option_1", "value": "Option 1" },
  { "key": "option_2", "value": "Option 2" }
]

---

Output Rules:

If enough information exists, return:

{
  "shouldContinue": false,
  "reason": "Explain briefly why no more questions are needed",
  "questions": []
}

---

If more information is needed (2 to 5 questions), return:

{
  "shouldContinue": true,
  "questions": [
    {
      "type": "TEXT",
      "question": "Your question here?",
      "answer": "",
      "defaultAnswer": ""
    }
  ]
}

---

Final Instructions:

- Generate between 2 to 5 questions (no less, no more) if continuing
- Do NOT generate IDs (they will be added later by the system)
- Keep questions clear and simple (user is not a designer)
- Prefer quality over quantity

Return ONLY valid JSON. No markdown, no explanations.
`;
}

export function buildLogoPromptGeneratorPrompt(allAnswers: Record<string, QuestionType[]>): string {
    const answersContext = Object.entries(allAnswers).map(([section, questions]) => {
        const sectionAnswers = buildQandAPrompt(questions);
        return `Section: ${section}\n${sectionAnswers}`;
    }).join('\n\n');

    return `You are an expert logo designer and AI image prompt engineer.
Based on the following brand brief answers, write a detailed, specific image generation prompt for creating a professional logo.

Brand Brief:
${answersContext}

Write a prompt for an image generation model that will create a high-quality logo.
The prompt should include:
- Style (minimalist, modern, classic, etc.)
- Color palette (specific colors based on preferences)
- Visual elements and symbols
- Typography style if relevant
- Overall mood and feel
- Technical specs: "vector style, clean background, professional logo design, high quality"

Return ONLY the image generation prompt text, nothing else. No explanations, no JSON, just the prompt.`;
}

export function buildSummaryPrompt(allAnswers: QuestionType[]): string {
    const answersContext = buildQandAPrompt(allAnswers);
    return `Summarize the following brand information into a concise brand brief:\n\n${answersContext}`;
}

export function buildQandAPrompt(allAnswers: QuestionType[]): string {
    return allAnswers.map(q =>
        `Q: ${q.question}\nA: ${q.answer || q.defaultAnswer || 'N/A'}`
    ).join('\n\n');
}