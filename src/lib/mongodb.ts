import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export function hasMongoConfig(): boolean {
  return Boolean(uri);
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    cachedPromise = new MongoClient(uri).connect();
  }

  cachedClient = await cachedPromise;
  return cachedClient;
}

export async function getPortfolioDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB ?? "aviation_portfolio");
}
