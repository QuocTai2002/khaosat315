import React from "react";

interface SurveySuggestionProps {
  iddanhmuc: number;
  thangtuoi: string;
  tendanhmuc: string;
}

export default function SurveySuggestion({
  tendanhmuc: label,
  thangtuoi: period,
}: SurveySuggestionProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 flex items-center gap-4 mb-4">
      <div className="bg-blue-200 rounded-full w-12 h-12 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="4" y="4" width="16" height="16" rx="4" />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-blue-700">{label}</div>
        <div className="text-xs text-gray-500">{period}</div>
      </div>
    </div>
  );
}
