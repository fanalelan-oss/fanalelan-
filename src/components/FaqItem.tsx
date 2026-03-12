'use client';

import { useState } from 'react';
import { ChevronDownIcon } from './icons';

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-xl font-semibold text-white focus:outline-none"
      >
        <span>{question}</span>
        <ChevronDownIcon
          className={`w-6 h-6 text-yellow-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 text-lg text-gray-300 leading-relaxed pr-8">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
