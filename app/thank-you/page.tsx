// app/thank-you/page.tsx
import Link from 'next/link';
import RTLlayout from '@/app/Components/RTLlayout';

export default function ThankYouPage() {
  return (
    <RTLlayout>
      <div className="container mx-auto px-5 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">با تشکر از شما!</h1>
        <p className="text-xl mb-8">پیام شما با موفقیت ارسال شد.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </RTLlayout>
  );
}