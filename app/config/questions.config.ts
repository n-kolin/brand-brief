import { QuestionnaireType } from "../types/question.type";
import { Sections } from "./sections.config";



const allQuestions: QuestionnaireType[] = [
    {
        id: Sections[0].id,
        title: Sections[0].title,
        questions: [{
            type: 'TEXT',
            id: 'q1',
            question: 'What is your name?',
            answer: '',
            defaultAnswer: 'שאלת טקסט ראונה',
        },
        {
            type: 'CHECKBOX',
            id: 'q2',
            question: 'אופציה 2 דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
                { key: '4', value: 'option 4', default: true },
                { key: '5', value: 'option 5', default: true },
                { key: '6', value: 'option 6' },
            ],
        },
        {
            type: 'TEXT',
            id: 'q3',
            question: 'אין דיפולט?',
            answer: '',
            defaultAnswer: '',
        },
        {
            type: 'DATE',
            id: 'q4',
            question: 'הדיפולט הוא 55555?',
            answer: '',
            defaultAnswer: '2026-01-01',
        },
        {
            type: 'DROPDOWN',
            id: 'q5',
            question: 'אין דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2' },
                { key: '3', value: 'option 3', default: true },
            ],
        },
        {
            type: 'RADIO',
            id: 'q6',
            question: 'דיפולט 2',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
            ],
        },]
    },
    {
        id: Sections[1].id,
        title: Sections[1].title,
        questions: [{
            type: 'TEXT',
            id: 'q1',
            question: 'What is your name?',
            answer: '',
            defaultAnswer: 'זה הסט השני!!!',
        },
        {
            type: 'CHECKBOX',
            id: 'q2',
            question: 'אופציה 2 דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
                { key: '4', value: 'option 4', default: true },
                { key: '5', value: 'option 5', default: true },
                { key: '6', value: 'option 6' },
            ],
        },
        {
            type: 'TEXT',
            id: 'q3',
            question: 'אין דיפולט?',
            answer: '',
            defaultAnswer: '',
        },
        {
            type: 'DATE',
            id: 'q4',
            question: 'הדיפולט הוא 55555?',
            answer: '',
            defaultAnswer: '2026-01-01',
        },
        {
            type: 'DROPDOWN',
            id: 'q5',
            question: 'אין דיפולט',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2' },
                { key: '3', value: 'option 3', default: true },
            ],
        },
        {
            type: 'RADIO',
            id: 'q6',
            question: 'דיפולט 2',
            answer: '',
            options: [
                { key: '1', value: 'option 1' },
                { key: '2', value: 'option 2', default: true },
                { key: '3', value: 'option 3' },
            ],
        },]
    },
]

export default allQuestions;
