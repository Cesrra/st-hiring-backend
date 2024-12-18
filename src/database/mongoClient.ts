import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is missing in the file .env');
}

let db: Db | null = null;

export const connectToMongo = async (): Promise<Db> => {
  if (db) return db;

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Coneted to MongoDB');
    db = client.db();
    return db;
  } catch (error) {
    console.error('Error to conected to MongoDB:', error);
    throw error;
  }
};
