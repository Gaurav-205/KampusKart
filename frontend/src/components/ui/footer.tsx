import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { socialLinks } from '../../utils/socialLinks';

const featureLinks = [
  { to: '/campus-map', label: 'Campus Map' },
  { to: '/events', label: 'Events' },
  { to: '/news', label: 'News' },
  { to: '/lostfound', label: 'Lost & Found' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/clubs-recruitment', label: 'Clubs' },
  { to: '/chat', label: 'Chat' },
];

const linkClass = 'text-sm text-gray-600 hover:text-kk-ink transition-colors duration-200';

/** Site-wide footer. Account links adapt to whether the visitor is signed in. */
export function Footer() {
  const { token } = useAuth();
  const accountLinks = token
    ? [
        { to: '/home', label: 'Home' },
        { to: '/profile', label: 'My profile' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Log in' },
        { to: '/signup', label: 'Sign up' },
      ];

  return (
    <footer className="border-t border-gray-200 bg-white pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link to={token ? '/home' : '/'} className="inline-flex items-center gap-3">
              <img src="/Logo.webp" alt="" className="h-7 w-7" />
              <span className="text-2xl font-extrabold text-kk-ink tracking-tight">KampusKart</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-600">
              Your all-in-one campus companion for MIT ADT University: events, news, lost &amp; found,
              complaints, facilities, clubs and chat.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-kk-ink hover:text-white hover:border-kk-ink transition-colors duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Features">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kk-ink mb-4">Features</h3>
            <ul className="space-y-3">
              {featureLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kk-ink mb-4">Account</h3>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-bold uppercase tracking-wider text-kk-ink mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className={linkClass}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms of service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} KampusKart. All rights reserved.</p>
          <p>Made for students at MIT ADT University.</p>
        </div>
      </div>
    </footer>
  );
}
