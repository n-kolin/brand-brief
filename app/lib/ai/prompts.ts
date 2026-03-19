import { QuestionType } from "@/app/types/question.type";


export function buildQuestionsPrompt(sectionTitle: string, answeredQuestions: QuestionType[]): string {
    const questionsContext = answeredQuestions.map(q =>
        `Q: ${q.question}\nA: ${q.answer || q.defaultAnswer || 'N/A'}`
    ).join('\n\n');
    
    return `You are an AI assistant that generates questions for a brand brief questionnaire.
Given the section "${sectionTitle}", analyze the conversation so far and decide if more questions are needed.

Previous Q&A pairs:
${questionsContext}

If you think we have enough information for this section, return:
{
  "shouldContinue": false,
  "reason": "Brief explanation why no more questions needed",
  "questions": []
}

If more questions would be helpful (maximum 3), return:
{
  "shouldContinue": true,
  "questions": [
    {
      "type": "TEXT",
      "id": "ai_q_${Date.now()}_1",
      "question": "Your question here?",
      "answer": "",
      "defaultAnswer": ""
    }
  ]
}

Valid question types: TEXT, RADIO, CHECKBOX, DROPDOWN, NUMBER, DATE
For RADIO, CHECKBOX, DROPDOWN - include "options" array with key and value.
Generate unique IDs using timestamp: "ai_q_${Date.now()}_1", "ai_q_${Date.now()}_2", etc.

Return ONLY valid JSON, no markdown, no extra text.`;
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