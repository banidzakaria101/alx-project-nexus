"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/16/solid";

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
      className="w-full flex items-center px-5 rounded-full border-white bg-white border shadow-lg mb-10">

      <Link href="/">
        <HomeIcon className="h-10 w-10 text-gray-500 mr-2" />
      </Link>

      <input
        type="text"
        className="flex-1 p-5 outline-none text-black"
        name="searchTerm"
        placeholder="Type a film name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}

export default SearchInput;