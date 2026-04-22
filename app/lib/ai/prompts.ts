import { QuestionType } from "@/app/types/question.type";


export function buildQuestionsPrompt(
  sectionTitle: string,
  answeredQuestions: QuestionType[],
  pendingQuestions: QuestionType[] = []
): string {

  const questionsContext = answeredQuestions.map(q =>
    `Q: ${q.question}\nA: ${q.answer || q.defaultAnswer || 'N/A'}`
  ).join('\n\n');

  const pendingContext = pendingQuestions.length > 0
    ? `\nQuestions already queued (DO NOT repeat or rephrase these):\n` +
      pendingQuestions.map(q => `- ${q.question}`).join('\n')
    : '';

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
${pendingContext}

---

Instructions:

Analyze the previous answers and decide:

1. Do we have enough information to make strong design decisions for THIS section?
2. If not — what critical information is missing specifically for this section?

---

Important Rules:

- You are STRICTLY limited to the CURRENT section: "${sectionTitle}"
- The questionnaire has other sections that will cover other topics — do NOT ask about them here
- Each section is handled separately — stay focused ONLY on what belongs to THIS section
- ONLY ask questions relevant to the CURRENT section

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

    return `
You are a senior logo designer, branding expert, and AI image prompt engineer.

Your task is to transform a brand brief into a highly detailed, precise image generation prompt for creating a professional logo.

---

Brand Brief:
${answersContext}

---

Instructions:

Write a single, high-quality prompt for an AI image generation model.

The prompt MUST be written in English.

HOWEVER:
- If the logo includes text (brand name / slogan), use the exact language requested by the user (Hebrew or English).
- Do NOT translate brand names or slogans.

---

Your goal is to create a prompt that produces a professional, clean, and visually strong logo.

---

The prompt MUST clearly and specifically include:

1. Logo style:
(e.g. minimalist, modern, luxury, playful, tech, geometric, abstract, emblem, etc.)

2. Color direction:
- Use specific colors when possible
- If user preference is weak → choose colors based on target audience and brand personality

3. Visual elements:
- Symbols, icons, shapes
- Avoid generic descriptions like "nice icon"
- Be specific (e.g. "abstract geometric lion", "clean financial graph line", etc.)

4. Typography:
- Font style (modern sans-serif, serif, bold, elegant, handwritten, etc.)
- Describe how text appears visually

5. Composition:
- Layout (icon + text, text-only, emblem, centered, horizontal, etc.)

6. Mood and feeling:
- What the logo should communicate (trust, innovation, fun, luxury, etc.)

7. Technical quality:
Always include:
"vector style, clean background, high contrast, professional logo design, sharp lines, minimal noise"

---

Important Rules:

- Be VERY specific and visual
- Do NOT use vague phrases like "beautiful", "nice", "cool"
- Avoid repetition
- Do NOT explain anything
- Do NOT write multiple options
- Do NOT use bullet points
- Write as a single continuous prompt

---

The output should be a ready-to-use image generation prompt.

Return ONLY the prompt text. No JSON. No explanations.
`;
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