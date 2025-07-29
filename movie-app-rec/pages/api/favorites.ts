import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/astra'; 
import { Movie } from '@/types'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Movie[] | { message: string }>
) {
  if (req.method === 'GET') {
    const { ids } = req.query; 

    if (!ids || typeof ids !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid "ids" query parameter.' });
    }

    const movieIds = ids.split(','); 

    if (movieIds.length === 0) {
      return res.status(200).json([]); 
    }

    try {
      const collection = db.collection<Movie>("mouvie_collection"); 

     
      const favoriteMovies = await collection.find(
        { _id: { $in: movieIds } },
        {
            
            sort: { Title: 1 }
        }
      ).toArray();

      return res.status(200).json(favoriteMovies);

    } catch (error) {
      console.error("❌ Error fetching favorite movies from Astra DB:", error);
      return res.status(500).json({ message: 'Internal server error while fetching favorites.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}