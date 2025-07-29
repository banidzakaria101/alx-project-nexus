import { GetServerSideProps } from "next";
import { Movie } from "@/types";
import MovieCard from "@/components/MovieCard";
import db from "@/lib/astra";
import SearchInput from "@/components/SearchInput";
import GenreFilter from "@/components/GenreFilter";
import Link from "next/link"; 
import { HeartIcon } from '@heroicons/react/24/solid';

const MOVIES_PER_PAGE = 25;
const MAX_COUNT_LIMIT = 1000;

const AVAILABLE_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama",
  "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
  "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western",
];

type Props = {
  movies: Movie[];
  page: number;
  totalPages: number;
};

export default function Home({ movies, page, totalPages }: Props) {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🎬 Movie Explorer</h1>
      
      <div className="flex items-center justify-between mb-8">
        <SearchInput />
        <Link href="/favorites" className="ml-4 p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors duration-200"
              aria-label="View Favorite Movies">
            <HeartIcon className="h-7 w-7" />
        </Link>
      </div>


      <GenreFilter availableGenres={AVAILABLE_GENRES} />

      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 justify-items-center">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = page === pageNum;

          const paginationHref = `/?page=${pageNum}`;

          return (
            <a
              key={pageNum}
              href={paginationHref}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                isActive
                  ? "bg-blue-500 text-white border-blue-500 scale-110 shadow-lg"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {pageNum}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt((context.query.page as string) || "1");
  const skip = (page - 1) * MOVIES_PER_PAGE;

  try {
    const collection = db.collection<Movie>("mouvie_collection");

    const query: Record<string, any> = {
      $vector: { $exists: true },
    };

    const results = await collection
      .find(query, {
        sort: { Title: 1 },
        limit: MOVIES_PER_PAGE,
      })
      .skip(skip)
      .toArray();

    const totalCount = await collection.countDocuments(query, MAX_COUNT_LIMIT);
    const totalPages = Math.ceil(totalCount / MOVIES_PER_PAGE);

    return {
      props: {
        movies: results,
        page,
        totalPages,
      },
    };
  } catch (error) {
    console.error("❌ Error fetching movies for homepage:", error);
    return {
      props: {
        movies: [],
        page,
        totalPages: 0,
      },
    };
  }
};