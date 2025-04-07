
import ContactForm from '../Components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>
        <ContactForm />
      </div>
    </div>
  );
}