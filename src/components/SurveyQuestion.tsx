import React from 'react';

interface SurveyQuestionProps {
  question: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export default function SurveyQuestion({ question, options, value, onChange }: SurveyQuestionProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="text-center text-base font-semibold text-gray-700 mb-2">{question}</div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {options.map(opt => (
          <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer ${value === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'}`}>
            <input
              type="radio"
              name="survey-option"
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
