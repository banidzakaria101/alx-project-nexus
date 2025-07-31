// components/FavoriteButton.tsx
"use client";

import { useState, useEffect } from 'react';
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface FavoriteButtonProps {
  movieId: string;
  onFavoriteChange?: (movieId: string, isNowFavorite: boolean) => void;
  // Removed 'variant' prop from here as your provided code effectively hardcodes it to 'card' variant output
  // If you need the 'details' variant back, we'll re-implement the conditional rendering for it.

  className?: string; // Allows external classes for positioning/styling
  iconSize?: string;  // e.g., 'h-6 w-6'
  padding?: string;   // e.g., 'p-1.5'
}

// This function now effectively renders only the icon-based button
function FavoriteButton({ movieId, onFavoriteChange, className, iconSize = 'h-6 w-6', padding = 'p-1.5' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // NEW: State to control animation

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

    // NEW: Trigger the animation
    setIsAnimating(true);
    // Remove animation class after a short duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 200); // Animation lasts 200ms

    if (onFavoriteChange) {
      onFavoriteChange(movieId, newIsFavoriteStatus);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      // Apply existing styles along with new animation classes
      className={`absolute top-2 right-2 bg-black bg-opacity-50 rounded-full cursor-pointer
                  text-white hover:text-red-500 transition-colors duration-200 z-10
                  ${padding} ${className || ''}
                  ${isAnimating ? 'scale-125 transition-transform duration-100 ease-out' : 'scale-100'}` /* NEW: Animation classes */}
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