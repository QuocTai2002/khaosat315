import React from 'react';

interface SurveyCompleteProps {
  onBack?: () => void;
}

export default function SurveyComplete({ onBack }: SurveyCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-orange-500 text-3xl font-bold mb-4">Hoàn thành</div>
      <div className="mb-8">
        <span className="inline-block bg-yellow-100 rounded-full p-6">
          <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="5" />
            <path d="M12 17v2M12 5v2M5 12H3m18 0h-2" />
          </svg>
        </span>
      </div>
      <div className="text-blue-600 text-lg font-semibold mb-6">Cảm ơn bạn đã tham gia khảo sát!</div>
      <button
        className="bg-blue-500 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
        onClick={onBack}
      >
        Trở về
      </button>
    </div>
  );
}
