'use client';

import Link from 'next/link';

interface HashtagItem {
  text: string;
  link?: string;
}

interface HashtagsBarProps {
  tags: (string | HashtagItem)[];
  className?: string;
}

export default function HashtagsBar({ tags, className = '' }: HashtagsBarProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 my-3 ${className}`} dir="rtl">
      {tags.map((tag, index) => {
        const text = typeof tag === 'string' ? tag : tag.text;
        const link = typeof tag === 'string' ? undefined : tag.link;

        const formattedText = text.startsWith('#') ? text : `#${text}`;

        const content = (
          <span className="inline-flex items-center gap-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-sm">
            {formattedText}
          </span>
        );

        if (link) {
          return (
            <Link key={index} href={link} className="no-underline">
              {content}
            </Link>
          );
        }

        return <div key={index}>{content}</div>;
      })}
    </div>
  );
}
