import { Outlet, useLocation } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import SideBar from './SideBar';

function Layout({ setToast }) {
  const mainRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Check if current page should show scroll-to-top button
  // Hide it on detail pages like /listings/:id
  const shouldShowScrollButton = !location.pathname.includes('/listings/');

  // Scroll to top detection
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    const target = mainRef.current;
    if (target) {
      target.addEventListener('scroll', handleScroll);
      return () => target.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, bottom nav on mobile */}
      <SideBar setToast={setToast} />

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="flex-1 md:ml-58 mb-20 md:mb-0 overflow-y-auto"
      >
        <Outlet />
      </main>

      {/* Scroll to top button - only show on listing/explore pages */}
      {showScrollTop && shouldShowScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-40 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-95 text-xl"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Layout;