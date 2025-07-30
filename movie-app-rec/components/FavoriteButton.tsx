"use client";

import { useState, useEffect } from 'react';
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface FavoriteButtonProps {
  movieId: string;
  onFavoriteChange?: (movieId: string, isNowFavorite: boolean) => void;
  variant?: 'card';


  className?: string;
  iconSize?: string;
  padding?: string;
}

function FavoriteButton({ movieId, onFavoriteChange, variant = 'card', className, iconSize = 'h-6 w-6', padding = 'p-1.5' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    setIsFavorite(favorites.includes(movieId));
  }, [movieId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');
    const newIsFavoriteStatus = !isFavorite;

    if (newIsFavoriteStatus) {
      favorites.push(movieId);
    } else {
      favorites = favorites.filter((id: string) => id !== movieId);
    }
    localStorage.setItem('favoriteMovieIds', JSON.stringify(favorites));
    setIsFavorite(newIsFavoriteStatus);

    if (onFavoriteChange) {
      onFavoriteChange(movieId, newIsFavoriteStatus);
    }
  };


  return (
    <button
      onClick={toggleFavorite}
      className={`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full cursor-pointer
                 text-white hover:text-red-500 transition-colors duration-200 z-10
                 ${padding} ${className || ''}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HeartSolidIcon className={`${iconSize} text-red-500`} />
      ) : (
        <HeartOutlineIcon className={`${iconSize}`} />
      )}
    </button>
  );
}

export default FavoriteButton;