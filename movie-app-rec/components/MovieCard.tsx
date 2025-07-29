// components/MovieCard.tsx
import { Movie, SimilarMovie } from "@/types";
import Link from "next/link";
import ImageFallback from "./ImageFallback";

function MovieCard({
  index,
  movie,
  similarity,
}: {
  index?: number;
  movie: Movie | SimilarMovie;
  similarity?: number;
}) {
  
  const movieDetailsHref = `/movie/${movie._id}?title=${encodeURIComponent(movie.Title)}`;

  return (
    <Link
      key={movie._id}
      href={movieDetailsHref} 
      className="block transform transition duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="relative bg-[#111] rounded-xl overflow-hidden shadow-lg">
        <ImageFallback
          className="w-full h-96 object-cover rounded-xl"
          src={movie.Poster}
          alt={movie.Title}
        />

        {similarity && (
          <div className="absolute w-14 h-14 flex items-center justify-center bottom-0 right-0 bg-blue-400 bg-opacity-90 p-2 rounded-full m-4 text-white text-sm font-bold shadow-md">
            {similarity}%
          </div>
        )}

        {index && (
          <div className="absolute text-gray-100 top-32 -left-10 text-9xl font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {index}
          </div>
        )}
      </div>

      <div className="pt-3">
        <p className="text-white text-lg font-semibold truncate w-64">
          {movie.Title}
        </p>
        <p className="text-gray-400 truncate">{movie.Genre}</p>
      </div>
    </Link>
  );
}

export default MovieCard;