import { Metadata } from 'next';
import SubmitWorkClient from './SubmitWorkClient';

export const metadata: Metadata = {
  title: 'بوابة إضافة الأعمال للشركاء — فن الإعلان',
  description: 'بوابة مخصصة لشركاء ومقاولي فن الإعلان لإضافة مشاريعهم وأعمالهم المنجزة إلى معرض أعمال الموقع الرسمي.',
  robots: {
    index: false, // Don't index the partner submission form on public search engines
    follow: false,
  },
};

export default function SubmitWorkPage() {
  return <SubmitWorkClient />;
}
