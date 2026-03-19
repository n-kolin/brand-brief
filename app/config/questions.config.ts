import { QuestionnaireType } from "../types/question.type";
import { Sections } from "./sections.config";

const allQuestions: QuestionnaireType[] = [
    {
        id: Sections[0].id,
        title: Sections[0].title,
        questions: [
            {
                type: 'TEXT',
                id: 'business-name',
                question: 'מה שם העסק?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'business-field',
                question: 'מהו תחום העיסוק של העסק?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'branding-goal',
                question: 'מהי המטרה העיקרית של המיתוג החדש?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'target-audience-basic',
                question: 'מי קהל היעד שלך?',
                answer: '',
                defaultAnswer: '',
            },
        ],
    },
    {
        id: Sections[1].id,
        title: Sections[1].title,
        questions: [
            {
                type: 'TEXT',
                id: 'competitors',
                question: 'מי המתחרים העיקריים שלך?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'competitive-advantage',
                question: 'מה היתרון התחרותי שלך?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'inspiring-brands',
                question: 'האם יש מותגים שאתה מעריך או מתחבר אליהם?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'brand-differentiator',
                question: 'מה מבדל אותך מהמתחרים?',
                answer: '',
                defaultAnswer: '',
            },
        ],
    },
    {
        id: Sections[2].id,
        title: Sections[2].title,
        questions: [
            {
                type: 'RADIO',
                id: 'has-logo',
                question: 'האם יש לך לוגו קיים?',
                answer: '',
                options: [
                    { key: 'yes', value: 'כן' },
                    { key: 'no', value: 'לא' },
                ],
            },
            {
                type: 'TEXT',
                id: 'logo-feedback',
                question: 'מה אתה אוהב ומה אתה לא אוהב בלוגו הנוכחי?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'elements-to-keep',
                question: 'האם יש צבעים או אלמנטים עיצוביים שחשוב לך לשמור?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'RADIO',
                id: 'design-style',
                question: 'איזה סגנון עיצובי מתאים לעסק שלך?',
                answer: '',
                options: [
                    { key: 'modern', value: 'מודרני' },
                    { key: 'classic', value: 'קלאסי' },
                    { key: 'minimal', value: 'מינימליסטי' },
                    { key: 'bold', value: 'נועז ובולט' },
                    { key: 'other', value: 'אחר' },
                ],
            },
        ],
    },
    {
        id: Sections[3].id,
        title: Sections[3].title,
        questions: [
            {
                type: 'TEXT',
                id: 'liked-colors',
                question: 'אילו צבעים אתה אוהב ומתחבר אליהם?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'disliked-colors',
                question: 'אילו צבעים אתה לא רוצה שיופיעו בעיצוב?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'RADIO',
                id: 'logo-type',
                question: 'איזה סוג לוגו אתה מעדיף?',
                answer: '',
                options: [
                    { key: 'graphic', value: 'גרפי (סמל בלבד)' },
                    { key: 'typographic', value: 'טיפוגרפי (שם בלבד)' },
                    { key: 'combined', value: 'שילוב של סמל ושם' },
                ],
            },
            {
                type: 'TEXT',
                id: 'design-examples',
                question: 'האם יש עיצובים שאתה אוהב? (תאר או ציין שמות)',
                answer: '',
                defaultAnswer: '',
            },
        ],
    },
    {
        id: Sections[4].id,
        title: Sections[4].title,
        questions: [
            {
                type: 'TEXT',
                id: 'audience-age',
                question: 'מה טווח הגילאים של קהל היעד שלך?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'RADIO',
                id: 'audience-gender',
                question: 'מה המגדר העיקרי של קהל היעד?',
                answer: '',
                options: [
                    { key: 'male', value: 'גברים' },
                    { key: 'female', value: 'נשים' },
                    { key: 'both', value: 'שניהם', default: true },
                ],
            },
            {
                type: 'TEXT',
                id: 'brand-values',
                question: 'אילו ערכים אתה רוצה שהמותג יעביר?',
                answer: '',
                defaultAnswer: '',
            },
            {
                type: 'TEXT',
                id: 'brand-message',
                question: 'מה המסר המרכזי שאתה רוצה שהלקוח יקבל כשהוא רואה את הלוגו?',
                answer: '',
                defaultAnswer: '',
            },
        ],
    },
];

export default allQuestions;
