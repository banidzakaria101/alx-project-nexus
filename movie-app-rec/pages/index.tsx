import { GetServerSideProps } from "next";
import { Movie } from "@/types";
import { getDb } from "@/lib/mongo";
import Link from "next/link";
import AnimatedMovieGrid from "@/components/AnimatedMovieGrid";

const MOVIES_PER_PAGE = 25;

type Props = {
  movies: Movie[];
  page: number;
  totalPages: number;
};

export default function Home({ movies, page, totalPages }: Props) {
  return (
    <div className="min-h-screen bg-black text-white px-10 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center sr-only">🎬 Movie Explorer</h1>

      <div className="mx-auto max-w-screen-2xl px-4">
        <AnimatedMovieGrid movies={movies} uniqueKey={page} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = page === pageNum;
          const paginationHref = `/?page=${pageNum}`;

          return (
            <Link
              key={pageNum}
              href={paginationHref}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${isActive
                  ? "bg-blue-500 text-white border-blue-500 scale-110 shadow-lg"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt((context.query.page as string) || "1");
  const skip = (page - 1) * MOVIES_PER_PAGE;

  try {
    const db = await getDb();
    const collection = db.collection<Movie>("movies");

    const [movies, totalCount] = await Promise.all([
      collection
        .find({})
        .sort({ Title: 1 })
        .skip(skip)
        .limit(MOVIES_PER_PAGE)
        .toArray(),
      collection.countDocuments({}),
    ]);

    const totalPages = Math.ceil(totalCount / MOVIES_PER_PAGE);

    return {
      props: {
        // Mongo's ObjectId and other non-plain fields need to be
        // serialized before passing to the page as props.
        movies: JSON.parse(JSON.stringify(movies)),
        page,
        totalPages,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Error fetching movies for homepage:", error);
    return {
      props: {
        movies: [],
        page,
        totalPages: 0,
      },
    };
  }
};