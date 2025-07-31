// pages/search/[term].tsx
import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie, SimilarMovie } from "@/types";
import MovieCard from "@/components/MovieCard"; // Ensure MovieCard is imported

interface SearchTermPageProps {
  term: string;
  similarMovies: Movie[];
  currentGenre: string | null;
}

export default function SearchTermPage({ term, similarMovies }: SearchTermPageProps) {
  // Callback for when a movie's favorite status changes on the card
  const handleFavoriteChange = (movieId: string, isNowFavorite: boolean) => {
    console.log(`Movie ${movieId} is now ${isNowFavorite ? 'favorited' : 'unfavorited'} from Search page.`);
    // You might want to add logic here if the search results need to react
    // to a favorite change (e.g., re-fetch if the list of favorites affects search results)
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10"> {/* Adjusted px for mobile first */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center"> {/* Changed text size for responsiveness */}
        Suggested results for: <span className="text-orange-400">{term}</span>
      </h1>

      <div className="mx-auto max-w-screen-2xl">
        {/* Using grid-cols-2 for mobile, and then scaling up */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 justify-center">
          {similarMovies.length > 0 ? (
            similarMovies.map((movie, index) => (
              <div key={movie._id} className="relative">
                {/* Pass onFavoriteChange to MovieCard */}
                <MovieCard movie={movie} index={index} onFavoriteChange={handleFavoriteChange} />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No results found.</p>
          )}
        </div>
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