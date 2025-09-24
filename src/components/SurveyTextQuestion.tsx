import React from 'react';

interface SurveyTextQuestionProps {
  question: string;
  value: string;
  onChange: (v: string) => void;
}

export default function SurveyTextQuestion({ question, value, onChange }: SurveyTextQuestionProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="text-center text-base font-semibold text-gray-700 mb-2">{question}</div>
      <textarea
        className="w-full max-w-xs rounded-lg border border-gray-200 p-2 text-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Vui lòng giải thích"
      />
    </div>
  );
}
