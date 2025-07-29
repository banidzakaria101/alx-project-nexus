"use client";

import { useRouter, useSearchParams } from "next/navigation"; 
import { useState, useEffect } from "react"; 
import Link from "next/link"; 

interface GenreFilterProps {
  availableGenres: string[];
}

function GenreFilter({ availableGenres }: GenreFilterProps) {
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre') || '';

  const handleGenreClick = (genre: string) => {
    if (genre === '') {
      
      router.push('/');
    } else {
      
      router.push(`/search/${encodeURIComponent(genre)}`);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
      <button
        onClick={() => handleGenreClick('')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
          ${currentGenre === '' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
        `}
      >
        All Genres
      </button>
      {availableGenres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleGenreClick(genre)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200
            ${currentGenre === genre ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
          `}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;