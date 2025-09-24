import React from 'react';

interface SurveyCategoryProps {
  categories: { label: string; color: string }[];
  onSelect: (cat: { label: string; color: string }) => void;
}


const SurveyCategory: React.FC<SurveyCategoryProps> = ({ categories, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-2 mb-4">
      {categories.map((cat, idx) => (
        <button
          key={cat.label}
          className={`px-4 py-2 rounded-full text-xs font-semibold ${cat.color} focus:outline-none`}
          onClick={() => onSelect(cat)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default SurveyCategory;
