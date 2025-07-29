// components/MovieCard.tsx
"use client"; // <--- ADD THIS LINE at the top

import { Movie, SimilarMovie } from "@/types";
import Link from "next/link";
import ImageFallback from "./ImageFallback";
import { useState, useEffect } from 'react'; // <--- Import useState and useEffect
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"; // <--- Import outline heart
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";   // <--- Import solid heart

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
  const [isFavorite, setIsFavorite] = useState(false); // State to track favorite status

  // Effect to check local storage when component mounts
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    setIsFavorite(favorites.includes(movie._id));
  }, [movie._id]); // Re-run if movie ID changes

  // Function to toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to movie details page
    e.stopPropagation(); // Stop event from bubbling up to the Link

    let favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter((id: string) => id !== movie._id);
    } else {
      // Add to favorites
      favorites.push(movie._id);
    }
    localStorage.setItem('favoriteMovieIds', JSON.stringify(favorites));
    setIsFavorite(!isFavorite); // Update local state
    // You might want to dispatch an event or use a global state manager here
    // if other components need to react immediately to favorite changes.
  };

  return (
    <Link
      key={movie._id}
      href={movieDetailsHref}
      className="block transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-600
                 w-40 sm:w-44 md:w-48 mx-auto
                 rounded-xl border border-transparent overflow-hidden relative" // Added 'relative' here for icon positioning
    >
      <div className="relative bg-[#111] rounded-xl overflow-hidden shadow-lg">
        <ImageFallback
          className="w-full h-60 object-cover rounded-xl"
          src={movie.Poster}
          alt={movie.Title}
        />

        {/* Favorite Icon */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1.5 cursor-pointer
                     text-white hover:text-red-500 transition-colors duration-200 z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-6 w-6 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-6 w-6" />
          )}
        </button>

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