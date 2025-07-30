"use client";

import { Movie, SimilarMovie } from "@/types";
import Link from "next/link";
import ImageFallback from "./ImageFallback";
import { useState, useEffect } from 'react';
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface MovieCardProps {
  index?: number;
  movie: Movie | SimilarMovie;
  similarity?: number;
  onFavoriteChange?: (movieId: string, isNowFavorite: boolean) => void;
}

function MovieCard({
  index,
  movie,
  similarity,
  onFavoriteChange
}: MovieCardProps) {
  const movieDetailsHref = `/movie/${movie._id}?title=${encodeURIComponent(movie.Title)}`;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    setIsFavorite(favorites.includes(movie._id));
  }, [movie._id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    const newIsFavoriteStatus = !isFavorite; 

    if (newIsFavoriteStatus) {
      favorites.push(movie._id);
    } else {
      favorites = favorites.filter((id: string) => id !== movie._id);
    }
    localStorage.setItem('favoriteMovieIds', JSON.stringify(favorites));
    setIsFavorite(newIsFavoriteStatus); 

    if (onFavoriteChange) {
      onFavoriteChange(movie._id, newIsFavoriteStatus);
    }
  };

  return (
    <Link
      key={movie._id}
      href={movieDetailsHref}
      className="group transform transition duration-300 hover:scale-105
                 bg-gray-950 rounded-lg shadow-lg overflow-hidden relative
                 flex flex-col h-full w-full max-w-[180px] sm:max-w-[200px]" 
    >
      {/* Image container with aspect ratio */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <ImageFallback
          className="w-full h-full object-cover rounded-t-lg"
          src={movie.Poster}
          alt={movie.Title}
        />


        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1.5 cursor-pointer
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
            {Math.round(similarity)}%
          </div>
        )}

        {index !== undefined && ( 
          <div className="absolute text-gray-100 top-20 -left-6 text-7xl font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {index + 1}
          </div>
        )}
      </div>

      {/* Text content area */}
      <div className="pt-2 pb-3 px-2 text-left flex flex-col flex-grow"> 
        <p className="text-white text-sm sm:text-base font-semibold line-clamp-2 leading-tight mb-1"> 
          {movie.Title}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-1">{movie.Genre}</p> 
      </div>
    </Link>
  );
}

export default MovieCard;