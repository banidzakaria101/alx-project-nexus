"use client";

import { useState, useEffect } from 'react';
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface FavoriteButtonProps {
  movieId: string;
  onFavoriteChange?: (movieId: string, isNowFavorite: boolean) => void;
  variant?: 'card' | 'details'; 
  className?: string; 
  iconSize?: string; 
  padding?: string;  
}

function FavoriteButton({ movieId, onFavoriteChange, variant = 'details', className, iconSize = 'h-6 w-6', padding = 'p-1.5' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); 

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

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 200); 

    if (onFavoriteChange) {
      onFavoriteChange(movieId, newIsFavoriteStatus);
    }
  };

  if (variant === 'card') {
    return (
      <button
        onClick={toggleFavorite}
        // Apply animation classes conditionally
        className={`${padding} rounded-full cursor-pointer text-white hover:text-red-500 transition-colors duration-200 z-10
                  ${isAnimating ? 'scale-125 transition-transform duration-100 ease-out' : 'scale-100'}
                  ${className || 'absolute top-2 left-2 bg-black bg-opacity-50'}`} // Default position and background for 'card'
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


  return (
    <button
      onClick={toggleFavorite}
      // Apply animation classes and other base styles
      className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200
                  bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                  ${isAnimating ? 'scale-110 transition-transform duration-100 ease-out' : 'scale-100'}
                  ${className || ''}`} 
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <HeartSolidIcon className={`${iconSize} text-red-500 mr-2`} />
      ) : (
        <HeartOutlineIcon className={`${iconSize} text-white mr-2`} />
      )}
      {isFavorite ? "Favorited" : "Add to Favorites"}
    </button>
  );
}

export default FavoriteButton;