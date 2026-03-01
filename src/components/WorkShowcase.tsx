'use client';

import { useState, useEffect } from 'react';
import WorkCard from './WorkCard';
import './WorkShowcase.css'; // Ensure this is imported

interface Work {
  title: string;
  category: string;
  imgSrc: string;
  description: string;
}

interface WorkShowcaseProps {
  allWorks: Work[];
}

const WorkShowcase = ({ allWorks }: WorkShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (allWorks.length <= 3) return;

    const timer = setInterval(() => {
      setIsExiting(true); // Start exit animation

      // Wait for exit animation to complete before updating content
      const transitionTimeout = setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 3) % allWorks.length);
        setIsExiting(false); // End exit, start enter animation
      }, 500); // This MUST match the CSS animation duration

      return () => clearTimeout(transitionTimeout);
    }, 5000); // Change cards every 5 seconds

    return () => clearInterval(timer);
  }, [allWorks.length]);

  // Determine which works to display
  const worksToShow = allWorks.slice(currentIndex, currentIndex + 3);
   if (worksToShow.length < 3 && allWorks.length > 3) {
        worksToShow.push(...allWorks.slice(0, 3 - worksToShow.length));
    }


  // Apply animation classes
  const containerClassName = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isExiting ? 'slide-out' : 'slide-in'}`;

  return (
    <div className={containerClassName}>
      {worksToShow.map((work, index) => (
        <WorkCard key={`${work.title}-${currentIndex + index}`} {...work} />
      ))}
    </div>
  );
};

export default WorkShowcase;
