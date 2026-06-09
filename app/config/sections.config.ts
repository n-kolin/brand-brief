// PATH: app/config/sections.config.ts
// הגדרת 5 הנושאים של השאלון + צבעי accent לכל נושא
export const Sections = [
    { id: "business-info", title: "מידע על העסק" },
    { id: "competition", title: "תחרות ושוק" },
    { id: "existing-identity", title: "זהות ויזואלית קיימת" },
    { id: "design-preferences", title: "העדפות עיצוביות" },
    { id: "target-audience", title: "קהל יעד ומסר" },
];

// צבע accent לכל section - Tailwind דורש classes מלאות (לא דינמיות)
export const SECTION_ACCENT_CLASSES: Record<string, {
    bg: string;
    bgLight: string;
    text: string;
    border: string;
    ring: string;
}> = {
    "business-info":    { bg: "bg-emerald-500",  bgLight: "bg-emerald-500/20",  text: "text-emerald-400",  border: "border-emerald-500",  ring: "ring-emerald-500/20" },
    "competition":      { bg: "bg-blue-500",      bgLight: "bg-blue-500/20",      text: "text-blue-400",      border: "border-blue-500",      ring: "ring-blue-500/20" },
    "existing-identity":{ bg: "bg-purple-500",    bgLight: "bg-purple-500/20",    text: "text-purple-400",    border: "border-purple-500",    ring: "ring-purple-500/20" },
    "design-preferences":{ bg: "bg-amber-500",   bgLight: "bg-amber-500/20",    text: "text-amber-400",    border: "border-amber-500",    ring: "ring-amber-500/20" },
    "target-audience":  { bg: "bg-rose-500",      bgLight: "bg-rose-500/20",      text: "text-rose-400",      border: "border-rose-500",      ring: "ring-rose-500/20" },
};

export type AccentClasses = typeof SECTION_ACCENT_CLASSES[string];
