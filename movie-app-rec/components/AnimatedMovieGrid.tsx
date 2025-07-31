// components/AnimatedMovieGrid.tsx
"use client";

import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import { Movie, SimilarMovie } from "@/types";

// Framer Motion Variants for staggering animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1 },
};

interface AnimatedMovieGridProps {
  movies: (Movie | SimilarMovie)[];
  onFavoriteChange?: (movieId: string, isNowFavorite: boolean) => void;
  uniqueKey?: string | number | null;
}

function AnimatedMovieGrid({ movies, onFavoriteChange, uniqueKey }: AnimatedMovieGridProps) {
  if (movies.length === 0) {
    return (
      <p className="text-gray-400 text-center text-xl mt-10">No movies to display.</p>
    );
  }

  return (
    
    <motion.div
      key={uniqueKey !== undefined && uniqueKey !== null ? uniqueKey : 'default-grid'} 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 justify-items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {movies.map((movie) => (
        <motion.div key={movie._id} variants={itemVariants}>
          <MovieCard movie={movie} onFavoriteChange={onFavoriteChange} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AnimatedMovieGrid;