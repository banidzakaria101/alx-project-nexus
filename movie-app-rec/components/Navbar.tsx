// components/Navbar.tsx
"use client";

import Link from "next/link";
import SearchInput from "./SearchInput";
import GenreFilter from "./GenreFilter";
import { HeartIcon, HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  currentGenre?: string;
}

function Navbar({ currentGenre }: NavbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const availableGenres = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setIsSearchOpen(false);
      }
    };
    if (isFilterOpen || isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen, isSearchOpen]);


  return (
    <nav
      ref={navbarRef}
      className={`sticky top-0 z-50 bg-gray-900 shadow-xl px-4 md:px-10
                   transition-all duration-300 ease-in-out overflow-hidden`}
      style={isFilterOpen ? { maxHeight: '300px' } : (isSearchOpen ? { maxHeight: '120px' } : { maxHeight: '68px' })}
    >
      <div className="flex items-center justify-between w-full py-3">
        {/* App Name */}
        <Link href="/" className="flex items-center text-white hover:text-orange-400 transition-colors duration-200 text-2xl sm:text-3xl font-bold whitespace-nowrap mr-4">
          <HomeIcon className="h-8 w-8 mr-2 hidden sm:block" />
          <span className="hidden sm:inline">Movie Explorer</span>
          <span className="sm:hidden">Movies</span>
        </Link>

        {/* Search Input for larger screens */}
        <div className="flex-grow mx-20 hidden md:block">
          <SearchInput />
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          {/* Search Icon for smaller screens */}
          <button
            type="button"
            className="md:hidden text-white hover:text-blue-400 transition-colors duration-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Genre Filter */}
          <GenreFilter
            isOpen={isFilterOpen}
            onToggle={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSearchOpen(false);
            }}
            availableGenres={availableGenres}
            currentGenre={currentGenre}
          />

          {/* Favorites Link */}
          <Link href="/favorites" className="flex items-center text-white hover:text-red-400 transition-colors duration-200 text-lg font-medium">
            <HeartIcon className="h-6 w-6" />
            <span className="hidden sm:inline ml-1">Favorites</span>
          </Link>
        </div>
      </div>

      {/* Search Input for smaller screens - conditionally rendered */}
      <div className={`w-full md:hidden mt-3 ${isSearchOpen ? 'block' : 'hidden'}`}>
        <SearchInput onSearch={() => setIsSearchOpen(false)} />
      </div>

      {/* Genre Filter Display Area */}
      <div
        className={`w-full flex flex-wrap justify-center gap-x-3 gap-y-2 py-3 px-4 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        {/* All Genres option */}
        <Link
          href="/"
          onClick={() => setIsFilterOpen(false)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200
            ${currentGenre === undefined ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
          `}
        >
          All Genres
        </Link>
        {/* Map through available genres */}
        {availableGenres.map((genre) => (
          <Link
            key={genre}
            href={`/search/${encodeURIComponent(genre)}`}
            onClick={() => setIsFilterOpen(false)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap
              ${currentGenre === genre ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            {genre}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;