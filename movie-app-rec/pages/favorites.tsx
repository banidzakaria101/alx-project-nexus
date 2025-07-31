// pages/favorites.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline'; // Import a trash icon for the clear button

function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!initialLoadComplete) {
      setLoading(true);
    }
    setError(null);
    try {
      const favoriteMovieIds = JSON.parse(localStorage.getItem('favoriteMovieIds') || '[]');

      if (favoriteMovieIds.length === 0) {
        setFavoriteMovies([]);
        setLoading(false);
        setInitialLoadComplete(true);
        return;
      }

      const idsQuery = favoriteMovieIds.join(',');
      const response = await fetch(`/api/favorites?ids=${idsQuery}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Movie[] = await response.json();
      setFavoriteMovies(data);

    } catch (e: any) {
      console.error("Failed to fetch favorite movies:", e);
      setError(`Failed to load favorites: ${e.message}`);
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);


  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);


  const handleFavoriteToggle = useCallback((movieId: string, isNowFavorite: boolean) => {
    if (!isNowFavorite) {
      setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie._id !== movieId));
    }
  }, []);

  const handleClearAllFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorite movies?")) {
      localStorage.removeItem('favoriteMovieIds');
      setFavoriteMovies([]);
    }
  };


  if (loading && !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
        <p className="text-xl">Loading favorite movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
        <Link href="/" className="mt-4 text-blue-400 hover:underline flex items-center">
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-14 py-10"> {/* Adjusted px for mobile first */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/" className="text-gray-400 hover:text-white mr-2 sm:mr-4"> {/* Adjusted margin for mobile */}
            <ArrowLeftIcon className="h-7 w-7 sm:h-8 sm:w-8" /> {/* Adjusted icon size for mobile */}
          </Link>
          {/* My Favorite Movies Title: Smaller on mobile, larger on sm screens and up */}
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">My Favorite Movies</h1>
        </div>

        {/* Clear All Favorites Button */}
        {favoriteMovies.length > 0 && (
          <button
            onClick={handleClearAllFavorites}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-3 rounded-lg {/* Smaller px on mobile */}
                       transition duration-200 ease-in-out shadow-md
                       text-sm"
            aria-label="Clear all favorite movies"
          >
            <TrashIcon className="h-5 w-5 mr-0 sm:mr-2" /> {/* Remove margin right on mobile */}
            <span className="hidden sm:inline">Clear All</span> {/* Hide text on mobile */}
          </button>
        )}
      </div>

      {favoriteMovies.length === 0 ? (
        <p className="text-gray-400 text-center text-xl mt-10">
          You haven't saved any favorite movies yet.
          <br />Go back to the <Link href="/" className="text-blue-400 hover:underline">homepage</Link> to add some!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 justify-center">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onFavoriteChange={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;