
import MovieCard from "@/components/MovieCard";
import db from "../lib/astra";
import { Movie } from "../types";

export default async function Home(){
  const movies = db.collection("movies");

  const allMovies = (await movies.find(
    {},
    {

    }
  )
.toArray()) as Movie[];

  return (
    <div>
      {allMovies.map((movie) =>(
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  )
}


