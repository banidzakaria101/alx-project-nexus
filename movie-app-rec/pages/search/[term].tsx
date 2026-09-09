import { GetServerSideProps } from "next";
import { getDb } from "@/lib/mongo";
import { Movie } from "@/types";
import AnimatedMovieGrid from "@/components/AnimatedMovieGrid";
import { motion } from "framer-motion";

interface SearchTermPageProps {
  term: string;
  similarMovies: Movie[];
  currentGenre: string | null;
}

const AVAILABLE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

export default function SearchTermPage({
  term,
  similarMovies,
}: SearchTermPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white px-6 py-10"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Suggested results for:{" "}
        <span className="text-orange-400">{term}</span>
      </h1>

      <div className="mx-auto max-w-screen-2xl">
        <AnimatedMovieGrid
          movies={similarMovies}
          uniqueKey={term}
        />
      </div>
    </motion.div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { term } = context.params as { term: string };

  let similarMovies: Movie[] = [];
  let currentGenre: string | null = null;

  if (AVAILABLE_GENRES.includes(term)) {
    currentGenre = term;
  }

  try {
    const db = await getDb();
    const collection = db.collection<Movie>("movies");

    /*
     * Search through the most useful movie fields.
     *
     * "i" = case-insensitive
     *
     * Example:
     * term = "batman"
     * -> searches Title, Genre, Director, Actors, Plot, etc.
     */
    const regex = {
      $regex: term,
      $options: "i",
    };

    const query =
      currentGenre !== null
        ? {
            Genre: {
              $regex: `(^|,\\s*)${escapeRegex(term)}(,|$)`,
              $options: "i",
            },
          }
        : {
            $or: [
              { Title: regex },
              { Genre: regex },
              { Director: regex },
              { Writer: regex },
              { Actors: regex },
              { Plot: regex },
              { Language: regex },
              { Country: regex },
              { Awards: regex },
            ],
          };

    similarMovies = await collection
      .find(query)
      .limit(20)
      .toArray();

    /*
     * MongoDB's ObjectId cannot be passed directly
     * from getServerSideProps to the browser.
     */
    similarMovies = JSON.parse(
      JSON.stringify(similarMovies)
    );

  } catch (error: unknown) {
    console.error(
      "❌ Error during MongoDB search on search page:",
      error
    );

    return {
      props: {
        term,
        similarMovies: [],
        currentGenre: null,
      },
    };
  }

  return {
    props: {
      term,
      similarMovies,
      currentGenre,
    },
  };
};

/**
 * Escape special regex characters so that a user search
 * such as "Spider-Man?" doesn't break the MongoDB regex.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}