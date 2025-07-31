// pages/movie/[id].tsx
import { GetServerSideProps } from "next";
import db from "@/lib/astra";
import { Movie, SimilarMovie } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import AnimatedMovieGrid from "@/components/AnimatedMovieGrid";
import { motion } from "framer-motion";

interface MovieDetailsPageProps {
  movie: Movie | null;
  similarMovies: SimilarMovie[];
}

export default function MovieDetailsPage({
  movie,
  similarMovies,
}: MovieDetailsPageProps) {
  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">
        Movie not found.
      </div>
    );
  }

  const handleFavoriteChange = (movieId: string, isNowFavorite: boolean) => {
    console.log(
      `Movie ${movieId} is now ${isNowFavorite ? "favorited" : "unfavorited"
      } from details page.`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white px-6 py-10"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        {movie.Title} ({movie.Year})
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto mb-12 bg-gray-900 p-6 rounded-lg shadow-xl">
        <div className="relative w-64 h-auto rounded-lg shadow-lg overflow-hidden flex-shrink-0">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpeg";
            }}
          />
          {movie && (
            <FavoriteButton
              movieId={movie._id}
              onFavoriteChange={handleFavoriteChange}
              variant="card"
              className="absolute top-4 right-4 bg-black bg-opacity-50"
              iconSize="h-7 w-7"
              padding="p-2"
            />
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-lg mb-2">
            <span className="font-semibold text-gray-400">Genre:</span>{" "}
            {movie.Genre}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-gray-400">Director:</span>{" "}
            {movie.Director}
          </p>
          <p className="mb-2">
            <span className="font-semibold text-gray-400">Actors:</span>{" "}
            {movie.Actors}
          </p>
          <p className="text-gray-300 mt-4">{movie.Plot}</p>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="mb-2">
              <span className="font-semibold text-gray-400">Country:</span>{" "}
              {movie.Country}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-400">Duration:</span>{" "}
              {movie.Runtime}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-400">Released:</span>{" "}
              {movie.Released}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-400">IMDb Rating:</span>{" "}
              {movie.imdbRating}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-400">IMDb Votes:</span>{" "}
              {movie.imdbVotes}
            </p>
            {movie.Awards && (
              <p className="mb-2">
                <span className="font-semibold text-gray-400">Awards:</span>{" "}
                {movie.Awards}
              </p>
            )}
            {movie.BoxOffice && (
              <p className="mb-2">
                <span className="font-semibold text-gray-400">Box Office:</span>{" "}
                {movie.BoxOffice}
              </p>
            )}
            {movie.Language && (
              <p className="mb-2">
                <span className="font-semibold text-gray-400">Language:</span>{" "}
                {movie.Language}
              </p>
            )}
            {movie.Metascore && (
              <p className="mb-2">
                <span className="font-semibold text-gray-400">Metascore:</span>{" "}
                {movie.Metascore}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <h2 className="text-2xl font-bold mb-6 text-center">Suggested Movies</h2>
      {similarMovies.length > 0 ? (
        <AnimatedMovieGrid
          movies={similarMovies}
          onFavoriteChange={handleFavoriteChange}
        />
      ) : (
        <p className="text-gray-400 text-center">No similar movies found.</p>
      )}
    </motion.div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, title } = context.params as { id: string; title?: string };

  const collection = db.collection<Movie>("mouvie_collection");
  let movie: Movie | null = null;
  let similarMovies: SimilarMovie[] = [];

  console.log(`--- Movie Details Page - ID: ${id} ---`);

  try {
    const movieDoc = (await collection.findOne({ _id: id })) as Movie | null;

    if (!movieDoc) {
      console.log(`Movie with ID ${id} not found in collection.`);
      return { notFound: true };
    }
    movie = movieDoc;
    console.log(`Fetched movie title: ${movie.Title}`);

    const recommendationTerm = movie.Plot || movie.Title || title;

    if (recommendationTerm) {
      console.log(
        `Performing vector search using term: "${recommendationTerm}"`
      );
      similarMovies = (await collection
        .find(
          {},
          {
            sort: {
              $vectorize: recommendationTerm,
            },
            limit: 11,
            includeSimilarity: true,
          }
        )
        .toArray()) as SimilarMovie[];

      console.log(
        `Vector search returned ${similarMovies.length} initial results.`
      );

      similarMovies = similarMovies
        .filter((simMovie) => simMovie._id !== movie!._id)
        .slice(0, 10);
      console.log(
        `After filtering, similarMovies length: ${similarMovies.length}`
      );
    } else {
      console.warn(
        `WARN: Skipping vector search for movie ${id} because no valid recommendation term (Plot/Title) found.`
      );
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
