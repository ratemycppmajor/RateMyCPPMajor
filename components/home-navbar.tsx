'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserButton } from './auth/user-button';
import { usePathname, useSearchParams } from 'next/navigation';

export default function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let callbackUrl = pathname;

  if (searchParams.toString()) {
    callbackUrl += '?${searchParams.toString()}';
  }

  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Majors', href: '/majors' },
    !user ? { name: 'Login', href: loginHref } : { name: 'User', href: '' },
  ];
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? `${window.scrollY > 100 && "border-b"} bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60` : 'bg-transparent'}`}
    >
      <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between h-16">
          <div className="md:hidden">
            <button
              className="md:hidden transition-transform duration-300 hover:scale-110"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="md:hidden"></div>

          <div>
            <Link href="/" className="text-xl font-bold">
              RateMyCPPMajor
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:underline rounded-md transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {!user ? (
              <Link
                href={loginHref}
                className="hover:underline hover:underline-offset-2  px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            ) : (
              <UserButton />
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((nav) =>
              nav.name === 'User' ? (
                <UserButton key={nav.name} />
              ) : (
                <Link
                  href={nav.href}
                  key={nav.name}
                  className="hover:underline hover:underline-offset-2 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {nav.name}
                </Link>
              ),
            )}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 md:px-3 lg:pl-3 lg:pr-14 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors border border-border bg-white"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden lg:inline text-muted-foreground">Search...</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            className={`md:hidden absolute top-full left-0 right-0 shadow-md overflow-hidden py-4 bg-white`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
              {navItems.map(
                (nav) =>
                  nav.name !== 'Login' &&
                  nav.name !== 'User' && (
                    <Link
                      href={nav.href}
                      key={nav.name}
                      className="hover:underline hover:underline-offset-2  px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {nav.name}
                    </Link>
                  ),
              )}
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <div
              className="bg-background rounded-lg shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search majors..."
                  autoFocus
                  className="flex-1 outline-none bg-transparent text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false)
                    }
                  }}
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground text-center py-8">Start typing to search for majors...</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
