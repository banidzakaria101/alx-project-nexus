"use client";

import Link from "next/link";
import SearchInput from "./SearchInput";
import GenreFilter from "./GenreFilter"; 
import { HeartIcon, HomeIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react"; 

function Navbar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const genreContainerRef = useRef<HTMLDivElement>(null); 

  const availableGenres = [ 
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western",
  ];


  const handleGenreClick = (genre: string) => {
    
    setIsFilterOpen(false); 
  };

  const handleAllGenresClick = () => {
    
    setIsFilterOpen(false); 
  };

  
  const navbarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);


  return (
    <nav
      ref={navbarRef} 
      
      className={`sticky top-0 z-50 bg-gray-900 shadow-xl px-6 md:px-10
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${isFilterOpen ? 'pb-4' : 'pb-0'}`} 
      style={isFilterOpen ? { maxHeight: '300px' } : { maxHeight: '68px' }} 
  
    >
      {/* Top row: Title, Search, Links */}
      <div className="flex items-center justify-between w-full py-3"> 
        {/* Left Section: Website Title / Home Link */}
        <Link href="/" className="flex items-center text-white hover:text-orange-400 transition-colors duration-200 text-2xl sm:text-3xl font-bold whitespace-nowrap mr-4">
          <HomeIcon className="h-8 w-8 mr-2" />
          Movie Explorer
        </Link>

        
        <div className="flex-grow max-w-xl mx-4 hidden md:block">
          <SearchInput />
        </div>

        {/* Right Section: Navigation Links */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Home link (optional, as logo serves as home) */}
          <Link href="/" className="text-white hover:text-blue-400 transition-colors duration-200 text-lg font-medium hidden sm:block">
            Home
          </Link>

          {/* Genre Filter Button - Pass state and toggle handler */}
          <GenreFilter isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />

          {/* Favorites Link */}
          <Link href="/favorites" className="flex items-center text-white hover:text-red-400 transition-colors duration-200 text-lg font-medium">
            <HeartIcon className="h-6 w-6 mr-1" />
            Favorites
          </Link>
        </div>
      </div>

      {/* Search Input for smaller screens (mobile view) */}
      <div className="w-full md:hidden mt-3">
          <SearchInput />
      </div>

     
      <div
        ref={genreContainerRef}
        className={`w-full flex flex-wrap justify-center gap-x-3 gap-y-2 py-3 px-4 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* All Genres option */}
        <Link
          href="/" 
          onClick={handleAllGenresClick}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200
            ${!isFilterOpen ? 'pointer-events-none' : ''} bg-orange-500 text-white hover:bg-orange-600
          `}
          
        >
          All Genres
        </Link>
        {/* Map through available genres */}
        {availableGenres.map((genre) => (
          <Link
            key={genre}
            href={`/search/${encodeURIComponent(genre)}`}
            onClick={() => handleGenreClick(genre)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200
              ${!isFilterOpen ? 'pointer-events-none' : ''} bg-gray-700 text-gray-300 hover:bg-gray-600
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