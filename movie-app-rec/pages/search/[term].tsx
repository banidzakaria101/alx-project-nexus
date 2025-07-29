import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie } from "@/types";

import MovieCard from "@/components/MovieCard";
import SearchInput from "@/components/SearchInput";

interface SearchTermPageProps {
  term: string;
  similarMovies: Movie[];
}

// displaying search results
export default function SearchTermPage({ term, similarMovies }: SearchTermPageProps) {
  return (

    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-black text-white">
      <h1 className="mb-6 text-xl text-white font-bold">
        Suggested results for: <span className="text-orange-400">{term}</span>
      </h1>
      <SearchInput />

      {/* Display similar movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {similarMovies.length > 0 ? (
          similarMovies.map((movie, index) => (
            <div key={movie._id} className="relative">
              <span className="absolute top-2 left-2 bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold z-10">
                {index + 1}
              </span>
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <p className="text-gray-400">No results found.</p>
        )}
      </div>
    </div>
  );
}

//  fetch data on each request to this page
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { term } = context.params as { term: string };

  let similarMovies: Movie[] = [];

  try {
    const collection = db.collection<Movie>("mouvie_collection");

    // vectorize search
    similarMovies = await collection.find(
      {},
      {
        sort: {
          $vectorize: term,
        },
        limit: 20,
      }
    ).toArray();

  } catch (error) {
    console.error("❌ Error during vector search:", error);
    return {
      props: {
        term,
        similarMovies: [],
      },
    };
  }

  return {
    props: {
      term,
      similarMovies,
    },
  };
};