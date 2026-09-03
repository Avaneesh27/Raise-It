import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/raiseit';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected successfully to MongoDB at ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
  } catch (error: any) {
    console.error(`[Database] Local connection failed: ${error.message}. Starting in-memory fallback...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at ${inMemoryUri}`);
    } catch (inMemError: any) {
      console.error(`[Database] In-memory fallback also failed: ${inMemError.message}`);
    }
  }
};
