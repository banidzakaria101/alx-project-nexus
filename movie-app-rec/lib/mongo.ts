import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ Missing MONGODB_URI in .env.local");
}

// In dev, Next.js hot-reloads modules, which would create a new
// MongoClient (and new connection) on every request unless we cache
// it on the global object.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {
  serverSelectionTimeoutMS: 5000, // fail fast instead of hanging
  family: 4 as const, // force IPv4, avoids the IPv6/TLS issue on Vercel
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  // Uses the database name from the URI path (e.g. /movieapp).
  // Falls back to "movieapp" if none was specified in the URI.
  return client.db(process.env.MONGODB_DB_NAME || "movieapp");
}

export default clientPromise;