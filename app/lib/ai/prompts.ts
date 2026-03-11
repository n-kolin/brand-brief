import { QuestionType } from "@/app/types/question.type";


export function buildQuestionsPrompt(sectionTitle: string, answeredQuestions: QuestionType[]): string {
    const questionsContext = buildQandAPrompt(answeredQuestions);
    return `You are an AI assistant that generates questions for a brand brief questionnaire.
Given the section "${sectionTitle}", generate 3 relevant and concise questions that help gather information for this section.
Here are the previously answered questions for context: ${questionsContext}`;
}

export function buildImagePrompt(allAnswers: Record<string, QuestionType[]>): string {
    const answersContext = Object.entries(allAnswers).map(([section, questions]) => {
        const sectionAnswers = buildQandAPrompt(questions);
        return `Section: ${section}\n${sectionAnswers}`;
    }).join('\n\n');

    return `Create a professional and visually appealing logo for a brand based on the following information gathered from a questionnaire:\n\n${answersContext}\n\nThe logo should reflect the brand's identity and values.`;
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