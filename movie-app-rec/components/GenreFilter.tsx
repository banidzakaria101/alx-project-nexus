"use client";

import { FunnelIcon } from "@heroicons/react/24/solid";


interface GenreFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  availableGenres: string[]; 
  currentGenre?: string; 
}

function GenreFilter({ isOpen, onToggle, currentGenre }: GenreFilterProps) { 


  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center items-center rounded-md px-3 py-2 text-sm font-medium text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        id="genre-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
      >
        <FunnelIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        Filter
      </button>

    </div>
  );
}

export default GenreFilter;