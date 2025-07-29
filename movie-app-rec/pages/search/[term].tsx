import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie, SimilarMovie } from "@/types";
import MovieCard from "@/components/MovieCard";


interface SearchTermPageProps {
  term: string;
  similarMovies: Movie[];
}

export default function SearchTermPage({ term, similarMovies }: SearchTermPageProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Removed h1 and SearchInput */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        Suggested results for: <span className="text-orange-400">{term}</span>
      </h1>

      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 justify-items-center">
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { term } = context.params as { term: string };

  let similarMovies: Movie[] = [];

  try {
    const collection = db.collection<Movie>("mouvie_collection");

    similarMovies = await collection.find(
      {},
      {
        sort: {
          $vectorize: term,
        },
        limit: 20,
        includeSimilarity: true,
      }
    ).toArray();

  } catch (error) {
    console.error("❌ Error during vector search on search page:", error);
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