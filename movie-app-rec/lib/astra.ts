// lib/astra.ts
import { DataAPIClient } from "@datastax/astra-db-ts";

let db: ReturnType<DataAPIClient["db"]>;

if (typeof window === "undefined") {
  // Only in Node.js (server-side)
  require("dotenv").config();

  const { ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT } = process.env;

  if (!ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_API_ENDPOINT) {
    throw new Error("❌ Missing Astra credentials. Make sure they are defined in .env.local");
  }

  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN, {
    httpOptions: {
      client: "fetch",
    },
  });

  db = client.db(ASTRA_DB_API_ENDPOINT);

  console.log("✅ Connected to Astra DB");
}

export default db!;
