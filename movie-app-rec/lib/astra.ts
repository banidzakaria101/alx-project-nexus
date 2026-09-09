// import { DataAPIClient } from "@datastax/astra-db-ts";

// const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
// const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
// const keyspace = process.env.ASTRA_DB_KEYSPACE || "default_keyspace";

// if (!endpoint) {
//   throw new Error("Missing ASTRA_DB_API_ENDPOINT");
// }

// if (!token) {
//   throw new Error("Missing ASTRA_DB_APPLICATION_TOKEN");
// }

// const client = new DataAPIClient();

// const db = client.db(endpoint, {
//   token,
//   keyspace,
// });

// export default db;