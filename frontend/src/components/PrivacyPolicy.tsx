import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './ui/footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-[72px]">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-kk-accent mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: October 30, 2026</p>

        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, update your profile, or use our services. This includes your name, email address, and any other information you choose to provide.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect to operate and improve KampusKart, communicate with you, and provide a personalised campus experience. We do not sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Data Storage and Security</h2>
            <p>Your data is stored in MongoDB Atlas, and photos you upload are stored with Cloudinary. Passwords are stored only as salted hashes. Resolved Lost &amp; Found items and complaints are deleted automatically 14 days after they are resolved, and items you delete are removed permanently after 7 days.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Browser Storage</h2>
            <p>KampusKart does not use tracking cookies. To keep you signed in, it stores a sign-in token in your browser&apos;s local storage (or session storage if you don&apos;t choose &quot;Remember me&quot;). Logging out removes it.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your Rights</h2>
            <p>You can view and correct your personal details at any time on your profile page, and delete the posts and complaints you created. To delete your account entirely, contact the KampusKart team as described below.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact the KampusKart team through the platform.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
