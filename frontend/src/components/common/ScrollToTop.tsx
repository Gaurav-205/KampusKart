import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router keeps the previous scroll position on client-side navigation, so opening a
// page from a card lower down the screen would land mid-page. Reset to the top whenever the
// path changes; in-page anchors (#hash) are left to the browser.
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
