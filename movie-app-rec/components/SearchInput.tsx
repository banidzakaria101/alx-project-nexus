"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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
    <form onSubmit={handleSubmit} className="flex items-center bg-gray-700 rounded-full py-2 px-4 shadow-inner">
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-base sm:text-lg mr-2"
        name="searchTerm"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Submit search">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}

export default SearchInput;