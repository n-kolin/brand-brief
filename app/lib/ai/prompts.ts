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
    ? pendingQuestions.map(q => `- ${q.question}`).join('\n')
    : 'None';

  return `Section Title: "${sectionTitle}"

Previous Q&A pairs:
${questionsContext}

Questions already queued (DO NOT repeat or rephrase these):
${pendingContext}`;
}


export function buildLogoUserPrompt(allAnswers: Record<string, QuestionType[]>): string {
    const answersContext = Object.entries(allAnswers).map(([section, questions]) => {
        const sectionAnswers = buildQandAPrompt(questions);
        return `Section: ${section}\n${sectionAnswers}`;
    }).join('\n\n');

    return `Create a logo prompt based on the following structured brand data:\n\n${answersContext}\n\n---\nGenerate a single, production-ready image generation prompt that reflects the brand identity.`;
}

export function buildQandAPrompt(allAnswers: QuestionType[]): string {
    return allAnswers.map(q => {
        let answerText = q.answer || q.defaultAnswer || 'N/A';

        if (q.options && q.answer) {
            if (Array.isArray(q.answer)) {
                const labels = (q.answer as string[])
                    .map(key => q.options!.find(o => o.key === key)?.value || key)
                    .join(', ');
                answerText = labels;
            } else {
                const option = q.options.find(o => o.key === q.answer);
                if (option) answerText = option.value;
            }
        }

        return `Q: ${q.question}\nA: ${answerText}`;
    }).join('\n\n');
}