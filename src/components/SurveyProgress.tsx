import React from 'react';

interface SurveyProgressProps {
  current: number;
  total: number;
  title: string;
}

export default function SurveyProgress({ current, total, title }: SurveyProgressProps) {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-orange-500 font-semibold text-lg mb-1">{title}</div>
      <div className="text-gray-500 text-sm">{current}/{total}</div>
    </div>
  );
}
