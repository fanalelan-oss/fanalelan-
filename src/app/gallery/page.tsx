'use client';

import { useState } from 'react';
import Link from 'next/link';
import { works } from '../../lib/data';
import AnimatedSection from '../../components/AnimatedSection';
import { ArrowLeftIcon } from '../../components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import WorkCard from '@/components/WorkCard'; // Using the advanced component

const categories = ['عرض الكل', ...new Set(works.map(work => work.category))];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('عرض الكل');

  const filteredWorks = selectedCategory === 'عرض الكل' 
    ? works 
    : works.filter(work => work.category === selectedCategory);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans text-right" dir="rtl">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        
        {/* Header Section */}
        <AnimatedSection id="gallery-header">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl sm:text-7xl font-extrabold animated-gradient-text pb-4 leading-tight">
              معرض أعمال فن الإعلان
            </h1>
            <p className="mt-8 text-xl text-gray-300 leading-relaxed font-medium">
              تصفح قصص نجاحنا في كل زاوية من زوايا الرياض. من واجهات الكلادينج الفخمة إلى اللوحات الإعلانية التي تضيء هوية عملائنا، نحن هنا لنحول رؤيتك إلى واقع ملموس.
            </p>
            <div className="mt-12">
                <Link href="/" className="group inline-flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10 transform hover:-translate-y-1">
                    <span>العودة للرئيسية</span>
                    <ArrowLeftIcon className="w-6 h-6 mr-3 transform transition-transform group-hover:translate-x-[-8px]" />
                </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Categories Filters */}
        <AnimatedSection id="gallery-filters" className="mt-24 mb-16">
          <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 shadow-2xl">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-3 text-lg font-bold rounded-2xl transition-all duration-500 
                  ${selectedCategory === category 
                    ? 'bg-gold-gradient text-black shadow-lg scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* The Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work, index) => (
              <motion.div
                key={`${work.imgSrc}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                {/* Advanced WorkCard with Hover Description & Popup */}
                <WorkCard {...work} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
      </main>
    </div>
  );
}
