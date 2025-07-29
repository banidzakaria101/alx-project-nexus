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
      className="w-full flex items-center px-4 py-2 rounded-full border border-gray-600 bg-gray-800 shadow-xl mb-10
                 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-300"
    >
      <Link href="/">
        <HomeIcon className="h-8 w-8 text-gray-400 hover:text-white transition-colors duration-200 mr-2" />
      </Link>

      <input
        type="text"
        className="flex-1 p-3 bg-transparent outline-none text-white placeholder-gray-400 text-lg" 
        name="searchTerm"
        placeholder="Type a film name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}

export default SearchInput;