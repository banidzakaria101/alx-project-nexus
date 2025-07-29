"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

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
    if (isNowFavorite) {
      
    } else {
      setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie._id !== movieId));
    }
    
  }, []); 


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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex items-center mb-8">
        <Link href="/" className="text-gray-400 hover:text-white mr-4">
          <ArrowLeftIcon className="h-8 w-8" />
        </Link>
        <h1 className="text-3xl font-bold">My Favorite Movies</h1>
      </div>

      {favoriteMovies.length === 0 ? (
        <p className="text-gray-400 text-center text-xl mt-10">
          You haven't saved any favorite movies yet.
          <br />Go back to the <Link href="/" className="text-blue-400 hover:underline">homepage</Link> to add some!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-4 gap-y-8 justify-items-center">
          {favoriteMovies.map((movie) => (
           
            <MovieCard key={movie._id} movie={movie} onFavoriteChange={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;