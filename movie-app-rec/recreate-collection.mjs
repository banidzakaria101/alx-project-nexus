// recreate-collection.mjs
//
// Recreates the "mouvie_collection" (renamed to "movie_collection" to
// start clean) with the same NVIDIA vectorize config, then re-imports
// all 250 movies from cleaned_movies.csv.
//
// Usage:
//   1. Place this file in your project root (movie-app-rec/)
//   2. Place cleaned_movies.csv in the same folder
//   3. Make sure ASTRA_DB_API_ENDPOINT and ASTRA_DB_APPLICATION_TOKEN
//      are set in your .env.local (or export them in your shell)
//   4. Run: node recreate-collection.mjs
//
// Requires: npm install csv-parse dotenv (if not already installed)

import { DataAPIClient } from "@datastax/astra-db-ts";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { config } from "dotenv";

// Next.js convention is .env.local, not .env — load that explicitly.
config({ path: ".env.local" });

const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
const keyspace = process.env.ASTRA_DB_KEYSPACE || "default_keyspace";

// Change this if you want to keep the old name — using a new name avoids
// any lingering bad state on the old collection and lets you compare
// both side by side before deleting the old one.
const NEW_COLLECTION_NAME = "movie_collection";
const CSV_PATH = "./cleaned_movies.csv";

if (!endpoint || !token) {
  throw new Error("Missing ASTRA_DB_API_ENDPOINT or ASTRA_DB_APPLICATION_TOKEN");
}

const client = new DataAPIClient();
const db = client.db(endpoint, { token, keyspace });

async function main() {
  console.log(`📖 Reading ${CSV_PATH}...`);
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(`✅ Parsed ${records.length} movies from CSV`);

  console.log(`🏗️  Creating collection "${NEW_COLLECTION_NAME}"...`);
  const collection = await db.createCollection(NEW_COLLECTION_NAME, {
    vector: {
      metric: "cosine",
      service: {
        provider: "nvidia",
        modelName: "nvidia/nv-embedqa-e5-v5",
      },
    },
    checkExists: false, // won't error if it already exists
  });
  console.log(`✅ Collection ready`);

  // Build documents. $vectorize gets auto-embedded server-side by NVIDIA.
  const docs = records.map((row) => ({
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
    // Text used to generate the embedding automatically:
    $vectorize: `${row.Title}. ${row.Genre}. ${row.Plot}`,
  }));

  console.log(`📤 Inserting ${docs.length} documents in batches of 20...`);
  const BATCH_SIZE = 20;
  let inserted = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    try {
      const result = await collection.insertMany(batch);
      inserted += result.insertedCount;
      console.log(`  ✅ Batch ${i / BATCH_SIZE + 1}: inserted ${result.insertedCount} (total: ${inserted}/${docs.length})`);
    } catch (err) {
      console.error(`  ❌ Batch ${i / BATCH_SIZE + 1} failed:`, err.message);
    }
  }

  console.log(`\n🎉 Done. Inserted ${inserted}/${docs.length} movies into "${NEW_COLLECTION_NAME}".`);
  console.log(`👉 Update your code to use collection name "${NEW_COLLECTION_NAME}" and test again.`);
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
