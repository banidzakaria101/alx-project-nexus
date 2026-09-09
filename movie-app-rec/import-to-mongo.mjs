// import-to-mongo.mjs
//
// Reads cleaned_movies.csv and inserts all movies into MongoDB Atlas.
//
// Usage:
//   1. Place this file in your project root (movie-app-rec/)
//   2. Place cleaned_movies.csv in the same folder
//   3. Make sure MONGODB_URI is set in .env.local
//   4. Run: node import-to-mongo.mjs
//
// Requires: npm install mongodb csv-parse dotenv (if not already installed)

import { MongoClient } from "mongodb";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "movieapp";
const COLLECTION_NAME = "movies";
const CSV_PATH = "./cleaned_movies.csv";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

async function main() {
  console.log(`📖 Reading ${CSV_PATH}...`);
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(`✅ Parsed ${records.length} movies from CSV`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const collection = db.collection(COLLECTION_NAME);

    // Clear out any previous test data in this collection first.
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑️  Clearing ${existingCount} existing documents...`);
      await collection.deleteMany({});
    }

    const docs = records.map((row) => ({
      _id: row.imdbID, // stable id so /movie/[id] routes keep working
      Title: row.Title,
      Year: row.Year,
      Rated: row.Rated,
      Released: row.Released,
      Runtime: row.Runtime,
      Genre: row.Genre,
      Director: row.Director,
      Writer: row.Writer,
      Actors: row.Actors,
      Plot: row.Plot,
      Language: row.Language,
      Country: row.Country,
      Awards: row.Awards,
      Poster: row.Poster,
      imdbRating: row.imdbRating,
      imdbVotes: row.imdbVotes,
      imdbID: row.imdbID,
      Type: row.Type,
      BoxOffice: row.BoxOffice,
    }));

    console.log(`📤 Inserting ${docs.length} documents...`);
    const result = await collection.insertMany(docs);
    console.log(`✅ Inserted ${result.insertedCount} movies`);

    // Create indexes: Title for sorting/pagination, Genre for
    // same-genre "Suggested Movies" lookups on the details page.
    await collection.createIndex({ Title: 1 });
    await collection.createIndex({ Genre: 1 });
    console.log("✅ Created indexes on Title and Genre");

    console.log(`\n🎉 Done. "${COLLECTION_NAME}" collection in database "${dbName}" is ready.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
