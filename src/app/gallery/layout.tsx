import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'معرض الأعمال',
  description: 'تصفح قصص نجاحنا في كل زاوية من زوايا الرياض. من واجهات الكلادينج الفخمة إلى اللوحات الإعلانية.',
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
