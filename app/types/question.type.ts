export type QuestionProps = {
    question: QuestionType;
    value: AnswerType;
    onChange: (newValue: AnswerType) => void;
}

export type AnswerType = string | number | Date | string[];

export type QuestionType = {
    type: 'TEXT'
    | 'RADIO'
    | 'CHECKBOX'
    | 'DROPDOWN'
    | 'NUMBER'
    | 'DATE'
    id: string;
    question: string;
    answer?: AnswerType;
    defaultAnswer?: string | number | Date;
    options?: { key: string, value: string, description?: string, default?: boolean }[];
}

export type QuestionnaireType = {
    id: string;
    title: string;
    questions: QuestionType[];
}