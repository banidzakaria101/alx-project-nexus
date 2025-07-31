// pages/search/[term].tsx
import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie, SimilarMovie } from "@/types";
// import MovieCard from "@/components/MovieCard"; // No longer directly imported
import AnimatedMovieGrid from "@/components/AnimatedMovieGrid"; // <--- Import the new component

interface SearchTermPageProps {
  term: string;
  similarMovies: Movie[];
  currentGenre: string | null;
}

export default function SearchTermPage({ term, similarMovies, currentGenre }: SearchTermPageProps) {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Suggested results for: <span className="text-orange-400">{term}</span>
      </h1>

      <div className="mx-auto max-w-screen-2xl px-4">
        {/* Replace the grid div with AnimatedMovieGrid */}
        <AnimatedMovieGrid movies={similarMovies} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { term } = context.params as { term: string };

  let similarMovies: Movie[] = [];
  let currentGenre: string | null = null;

  const AVAILABLE_GENRES = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western",
  ];
  if (AVAILABLE_GENRES.includes(term)) {
    currentGenre = term;
  }

  try {
    const collection = db.collection<Movie>("mouvie_collection");

    similarMovies = await collection.find(
      {},
      {
        sort: {
          $vectorize: term,
        },
        limit: 20, // Keep your desired limit
        includeSimilarity: true,
      }
    ).toArray() as SimilarMovie[]; // Cast to SimilarMovie[] if includeSimilarity is true

  } catch (error) {
    console.error("❌ Error during vector search on search page:", error);
    return {
      props: {
        term,
        similarMovies: [],
        currentGenre: null,
      },
    };
  }

  return {
    props: {
      term,
      similarMovies,
      currentGenre,
    },
  };
};