import React from 'react';

interface ChildListProps {
  childrenNames: string[];
  onSelect: (name: string) => void;
  selectedName: string | null;
}

export default function ChildList({ childrenNames, onSelect, selectedName }: ChildListProps) {
  return (
    <ul className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm mt-2">
      {childrenNames.map((name) => (
        <li
          key={name}
          className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedName === name ? 'bg-blue-100 text-primary font-semibold' : 'text-gray-700'}`}
          onClick={() => onSelect(name)}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
