import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  function handleToggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col font-body">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gallery-950/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
            Art Gallery
          </Link>

          {/* Desktop nav */}
          <ul className="hidden gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`transition-colors hover:text-accent ${
                    location.pathname === link.to ? 'text-accent' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={handleToggleMenu}
            className="flex h-10 w-10 items-center justify-center text-gray-300 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-white/10 bg-gallery-950 px-6 py-4 md:hidden">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={handleCloseMenu}
                    className={`block text-sm font-medium transition-colors hover:text-accent ${
                      location.pathname === link.to ? 'text-accent' : 'text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gallery-950 text-gray-400">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Art Gallery</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Curating extraordinary art experiences since 1987. Discover masterpieces from around
                the world.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Visit Us</h3>
              <p className="mt-2 text-sm leading-relaxed">
                123 Gallery Avenue
                <br />
                Arts District, NY 10001
                <br />
                Tue - Sun, 10am - 6pm
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Connect</h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} Art Gallery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
