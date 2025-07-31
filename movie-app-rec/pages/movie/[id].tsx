// pages/movie/[id].tsx
import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie, SimilarMovie } from "@/types";
// import MovieCard from "@/components/MovieCard"; // No longer directly imported for similar movies
import FavoriteButton from "@/components/FavoriteButton";
import AnimatedMovieGrid from "@/components/AnimatedMovieGrid"; // <--- Import the new component

interface MovieDetailsPageProps {
  movie: Movie | null;
  similarMovies: SimilarMovie[];
}

export default function MovieDetailsPage({ movie, similarMovies }: MovieDetailsPageProps) {
  if (!movie) {
    return <div className="text-white text-center p-10">Movie not found.</div>;
  }

  const handleFavoriteChange = (movieId: string, isNowFavorite: boolean) => {
    console.log(`Movie ${movieId} is now ${isNowFavorite ? 'favorited' : 'unfavorited'} from details page.`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* Title section */}
      <h1 className="text-3xl font-bold text-center mb-6">{movie.Title} ({movie.Year})</h1>

      {/* Movie Details Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto mb-12 bg-gray-900 p-6 rounded-lg shadow-xl">
        {/* Left side: Poster and Favorite Button */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-64 h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpeg";
            }}
          />
          {movie && (
            <FavoriteButton
              movieId={movie._id}
              onFavoriteChange={handleFavoriteChange}
              variant="details"
              className="mt-2"
            />
          )}
        </div>

        {/* Right side: Text Details */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-lg mb-2"><span className="font-semibold text-gray-400">Genre:</span> {movie.Genre}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Director:</span> {movie.Director}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Actors:</span> {movie.Actors}</p>
          <p className="text-gray-300 mt-4">{movie.Plot}</p>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="mb-2"><span className="font-semibold text-gray-400">Country:</span> {movie.Country}</p>
            <p className="mb-2"><span className="font-semibold text-gray-400">Duration:</span> {movie.Runtime}</p>
            <p className="mb-2"><span className="font-semibold text-gray-400">Released:</span> {movie.Released}</p>
            <p className="mb-2"><span className="font-semibold text-gray-400">IMDb Rating:</span> {movie.imdbRating}</p>
            <p className="mb-2"><span className="font-semibold text-gray-400">IMDb Votes:</span> {movie.imdbVotes}</p>
            {movie.Awards && <p className="mb-2"><span className="font-semibold text-gray-400">Awards:</span> {movie.Awards}</p>}
            {movie.BoxOffice && <p className="mb-2"><span className="font-semibold text-gray-400">Box Office:</span> {movie.BoxOffice}</p>}
            {movie.Language && <p className="mb-2"><span className="font-semibold text-gray-400">Language:</span> {movie.Language}</p>}
            {movie.Metascore && <p className="mb-2"><span className="font-semibold text-gray-400">Metascore:</span> {movie.Metascore}</p>}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <h2 className="text-2xl font-bold mb-6 text-center">Suggested Movies</h2>
      {similarMovies.length > 0 ? (
        // Replace the grid div with AnimatedMovieGrid
        <AnimatedMovieGrid movies={similarMovies} onFavoriteChange={handleFavoriteChange} />
      ) : (
        <p className="text-gray-400 text-center">No similar movies found.</p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, title } = context.params as { id: string; title?: string };

  const collection = db.collection<Movie>("mouvie_collection");
  let movie: Movie | null = null;
  let similarMovies: SimilarMovie[] = [];

  console.log(`--- Movie Details Page - ID: ${id} ---`);

  try {
    const movieDoc = await collection.findOne({ _id: id }) as Movie | null;

    if (!movieDoc) {
      console.log(`Movie with ID ${id} not found in collection.`);
      return { notFound: true };
    }
    movie = movieDoc;
    console.log(`Fetched movie title: ${movie.Title}`);

    const recommendationTerm = movie.Plot || movie.Title || title;

    if (recommendationTerm) {
      console.log(`Performing vector search using term: "${recommendationTerm}"`);
      similarMovies = await collection.find(
        {},
        {
          sort: {
            $vectorize: recommendationTerm,
          },
          limit: 11,
          includeSimilarity: true,
        }
      ).toArray() as SimilarMovie[];

      console.log(`Vector search returned ${similarMovies.length} initial results.`);

      similarMovies = similarMovies.filter(simMovie => simMovie._id !== movie!._id).slice(0, 10);
      console.log(`After filtering, similarMovies length: ${similarMovies.length}`);

    } else {
      console.warn(`WARN: Skipping vector search for movie ${id} because no valid recommendation term (Plot/Title) found.`);
    }

  } catch (error) {
    console.error("❌ Error fetching movie details or similar movies:", error);
    return {
      props: {
        movie: null,
        similarMovies: [],
      },
    };
  }

  console.log("--- Movie Details Page - End getServerSideProps ---");
  return {
    props: {
      movie,
      similarMovies,
    },
  };
};