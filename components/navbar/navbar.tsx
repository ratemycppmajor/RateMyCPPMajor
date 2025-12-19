'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserButton } from '../auth/user-button';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface NavbarProps {
  home?: boolean;
}

interface SearchMajor {
  id: string;
  name: string;
  slug: string;
  imgSrc: string | null;
  department: {
    name: string;
    college: {
      name: string;
    };
  };
}

export default function Navbar({ home = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchMajor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  let callbackUrl = pathname;

  if (searchParams.toString()) {
    callbackUrl += `?${searchParams.toString()}`;
  }

  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Majors', href: '/majors' },
    !user ? { name: 'Login', href: loginHref } : { name: 'User', href: '' },
  ];

  useEffect(() => {
    if (home) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [home]);

  const searchMajors = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(`/api/majors/search?q=${encodeURIComponent(query)}`);
      
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.majors || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching majors:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSearchOpen) {
        searchMajors(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isSearchOpen, searchMajors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMajorClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/majors/${slug}`);
  };

  const headerClassName = home
    ? `sticky top-0 left-0 right-0 z-50 ${
        isScrolled
          ? 'border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'
          : `${isOpen ? 'bg-white' : 'bg-transperent'}`
      }`
    : `sticky top-0 z-50 w-full text-primary ${
        isOpen
          ? 'bg-white'
          : 'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'
      }`;

  return (
    <header className={headerClassName}>
        <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className="flex items-center justify-between h-16">
                <div className="md:hidden">
                    <button
                        className="md:hidden transition-transform duration-300 hover:scale-110 cursor-pointer"
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
                        className="flex items-center gap-2 md:px-3 lg:pl-3 lg:pr-14 py-2 mr-0 rounded-md text-sm font-medium hover:bg-accent transition-colors border border-border bg-white cursor-pointer"
                        aria-label="Search"
                    >
                        <Search size={16} />
                        <span className="hidden lg:inline text-muted-foreground">Search...</span>
                    </button>
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
                                className="hover:underline hover:underline-offset-2 px-3 py-2 rounded-md text-sm font-medium"
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
                        onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            setSearchResults([]);
                        }}
                    >
                        <div
                            className="bg-background rounded-lg shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 p-4 border-b">
                                <Search size={20} className="text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search majors..."
                                    autoFocus
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="flex-1 outline-none bg-transparent text-base"
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }
                                    }}
                                />
                                {isSearching && (
                                    <Loader2 size={20} className="text-muted-foreground animate-spin" />
                                )}
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="p-1 hover:bg-accent rounded-md transition-colors cursor-pointer"
                                    aria-label="Close search"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {searchQuery.trim() === '' ? (
                                    <div className="p-4">
                                        <p className="text-sm text-muted-foreground text-center py-8">Start typing to search for majors...</p>
                                    </div>
                                ) : searchResults.length === 0 && !isSearching ? (
                                    <div className="p-4">
                                        <p className="text-sm text-muted-foreground text-center py-8">No majors found. Try a different search term.</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {searchResults.map((major) => (
                                            <button
                                                key={major.id}
                                                onClick={() => handleMajorClick(major.slug)}
                                                className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors flex items-center gap-3 cursor-pointer"
                                            >
                                                {major.imgSrc && (
                                                    <Image
                                                        src={major.imgSrc}
                                                        alt={major.name}
                                                        width={48}
                                                        height={48}
                                                        unoptimized
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{major.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {major.department.college.name} • {major.department.name}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    </header>
  )
}
