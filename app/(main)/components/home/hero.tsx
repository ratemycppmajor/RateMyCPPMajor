'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input"
import HomeNavbar from '../../../../components/navbar/home-navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const Hero = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchMajor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMajorClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/majors/${slug}`);
  };


  return (
    <div className="text-primary" style={{background: "linear-gradient(0deg,rgba(255, 255, 255, 1) 40%, rgba(255, 184, 28, 1) 60%, rgba(164, 214, 94, 1) 100%)"}}>
      <HomeNavbar />
            
      <div className="mx-auto max-w-7xl flex-col px-6 py-20 flex lg:items-center gap-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0">
          <h1 className="mt-10 text-4xl font-bold sm:text-6xl text-center">
            Your Gateway to
          </h1>
          
          <span className='text-4xl font-bold sm:text-6xl text-center block'>CPP Major Insights</span>
          <p className="mt-6 text-xl leading-8 font-medium text-center">
            Student reviews and ratings for CPP majors.
          </p>
        </div>

        <div ref={searchRef} className="relative lg:w-2xl w-96 mx-auto z-20">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="px-6 py-5 bg-white border-primary [&::-webkit-search-cancel-button]:appearance-none"
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
              }
            }}
            aria-label="CPP Major Search Input"
          />
          {isSearchOpen &&
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto border-primary">
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
          }
        </div>

        <div className="mx-auto mt-16 lg:mt-0">
          <video
            playsInline
            loop
            autoPlay
            muted
            className="
              relative z-10 w-full 
              rounded-[20px] 
              object-cover 
              bg-transparent 
              cursor-auto 
              shadow-[0_0_20px_10px_rgba(164,214,94,0.5)] 
              object-center
              block
            "
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
          </video>
        </div>

      </div>
    </div>
  );
};

export default Hero;
