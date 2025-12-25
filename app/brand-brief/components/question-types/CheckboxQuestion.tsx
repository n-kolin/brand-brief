import { QuestionProps } from '@/app/types/question.type'

export default function CheckboxQuestion({ question, value, onChange }: QuestionProps) {

    const selectedKeys = (value as string[]) || [];

    const handleToggle = (key: string) => {
        let newSelection: string[];
        if (selectedKeys.includes(key)) {
            newSelection = selectedKeys.filter(k => k !== key); 
        } else {
            newSelection = [...selectedKeys, key]; 
        }
        onChange(newSelection);
    };

    return (
        <div>
             {question.options?.map(option => (
                <div key={option.key}>
                    <input
                        type="checkbox"
                        checked={selectedKeys.includes(option.key)}
                        onChange={() => handleToggle(option.key)}
                    />
                    <label>{option.value}</label>
                </div>
            ))}

        </div>
    )
}
