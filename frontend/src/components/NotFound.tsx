import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound: React.FC = () => {
  const { token } = useAuth();
  const homePath = token ? '/home' : '/';

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">Error 404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-kk-ink">Page not found</h1>
        <p className="mt-4 text-base text-gray-600">
          The page you are looking for doesn&apos;t exist or has moved. Check the address, or head back
          to the start.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center min-h-touch px-6 rounded-lg font-semibold text-white bg-kk-ink hover:bg-kk-graphite transition-colors"
          >
            Go to home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center min-h-touch px-6 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
