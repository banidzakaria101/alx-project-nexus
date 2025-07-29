export interface Movie {
  _id: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot?: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings_0_Source?: string;
  Ratings_0_Value?: string;
  Ratings_1_Source?: string;
  Ratings_1_Value?: string;
  Ratings_2_Source?: string;
  Ratings_2_Value?: string;
  Metascore?: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response?: string;
  $vectorize?: string;
  $vector?: number[];
}

export interface SimilarMovie extends Movie {
  $similarity: number;
}

export interface SimilarMovies {
  movies: Movie[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
