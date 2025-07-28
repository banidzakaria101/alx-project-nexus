/*import { DataAPIClient } from "@datastax/astra-db-ts";

let db: ReturnType<DataAPIClient["db"]>;

if (typeof window === "undefined") {
  require("dotenv").config();

  const {
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_KEYSPACE,
  } = process.env;

  if (!ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_API_ENDPOINT || !ASTRA_DB_KEYSPACE) {
    throw new Error("❌ Missing Astra DB credentials or keyspace. Make sure ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT, and ASTRA_DB_KEYSPACE are defined in your .env.local file.");
  }

  const client = new DataAPIClient(
    ASTRA_DB_APPLICATION_TOKEN,
    {}
  );

  db = client.db(ASTRA_DB_KEYSPACE);

  console.log(`✅ Connected to Astra DB keyspace: ${ASTRA_DB_KEYSPACE}`);
}

export default db!;
*/