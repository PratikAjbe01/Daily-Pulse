import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable in .env.local'
  );
}


let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
    
    }).then((mongoose) => {
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
