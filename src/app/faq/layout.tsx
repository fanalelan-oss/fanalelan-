import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
  description: 'إجابات شاملة لكل أسئلتك حول خدمات فن الإعلان في واجهات الكلادينج واللوحات الدعائية بالرياض.',
  alternates: {
    canonical: '/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
