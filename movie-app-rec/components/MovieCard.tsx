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
     
      className="block transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-600
                 w-40 sm:w-44 md:w-48 mx-auto
                 rounded-xl border border-transparent overflow-hidden" 
    >
      <div className="relative bg-[#111] rounded-xl overflow-hidden shadow-lg"> 
        <ImageFallback
          className="w-full h-60 object-cover rounded-xl"
          src={movie.Poster}
          alt={movie.Title}
        />

        {similarity && (
          <div className="absolute w-12 h-12 flex items-center justify-center bottom-0 right-0 bg-blue-400 bg-opacity-90 p-1 rounded-full m-3 text-white text-xs font-bold shadow-md">
            {similarity}%
          </div>
        )}

        {index && (
          <div className="absolute text-gray-100 top-20 -left-6 text-7xl font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {index}
          </div>
        )}
      </div>

      {/* Text content below image */}
      <div className="pt-2 pb-1 text-center">
        <p className="text-white text-base font-semibold truncate w-full px-1">
          {movie.Title}
        </p>
        <p className="text-gray-400 text-sm truncate w-full px-1">{movie.Genre}</p>
      </div>
    </Link>
  );
}

export default MovieCard;