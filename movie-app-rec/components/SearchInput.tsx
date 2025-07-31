"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';



interface SearchInputProps {
  onSearch?: () => void; 
}

function SearchInput({ onSearch }: SearchInputProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${searchTerm}`);
      if (onSearch) {
        onSearch();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-full py-1 px-4 shadow-inner"
    >
      {/* GIF Image*/}
      <img
        src="/icons8-film-reel.gif"
        alt="Film Reel Icon"
        style={{ height: '30px', width: '30px' }}
        className="mr-2"
      />

      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-black placeholder-gray-600 text-base"
        name="searchTerm"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button type="submit" className="text-black hover:text-blue-900 transition-colors duration-200" aria-label="Submit search">
        <MagnifyingGlassIcon className="h-8 w-8" />
      </button>
    </form>
  );
}

export default SearchInput;