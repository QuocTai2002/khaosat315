import React from "react";

interface SurveyQuestionProps {
  question: string;
  img?: string; // url hình ảnh nếu có
  options: Array<{
    cauhoi: string;
    diem: number;
    iddapan: number;
    noidung: string;
    sudung: boolean;
  }>;
  value: string;
  onChange: (v: number) => void;
}

export default function SurveyQuestion({
  question,
  img,
  options,
  value,
  onChange,
}: SurveyQuestionProps) {
  // Tìm hình ảnh đầu tiên trong options (nếu có)

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      {img && (
        <img
          src={img}
          alt="Câu hỏi hình ảnh"
          className="mb-2 w-32 h-32 object-contain"
        />
      )}
      <div className="text-center text-base font-semibold text-gray-700 mb-2">
        {question}
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {options.map((opt) => (
          <label
            key={opt.iddapan}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer ${
              Number(value) === opt.iddapan
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="survey-option"
              value={opt.iddapan}
              checked={Number(value) === opt.iddapan}
              onChange={() => onChange(opt.iddapan)}
              className="accent-blue-500"
            />
            {opt.noidung}
          </label>
        ))}
      </div>
    </div>
  );
}
