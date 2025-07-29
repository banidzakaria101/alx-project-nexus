// components/SearchInput.tsx
"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";

function SearchInput() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${searchTerm}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}
      // Removed w-full, parent Navbar div will control width
      className="flex items-center bg-gray-700 rounded-full py-2 px-4 shadow-inner"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-base sm:text-lg"
        name="searchTerm"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}

export default SearchInput;