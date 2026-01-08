import mongoose from 'mongoose';

export async function connectToDatabase() {
  // Prefer explicit init DB name, otherwise try to parse it from MONGO_URI
  const envDb = process.env.MONGO_INITDB_DATABASE;
  let dbName = envDb;
  const uriFromEnv = process.env.MONGO_URI || '';
  if (!dbName) {
    try {
      const match = uriFromEnv.match(/\/([A-Za-z0-9_-]+)(\?|$)/);
      if (match) dbName = match[1];
    } catch {
      // ignore
    }
  }
  dbName = dbName || 'photografedi';
  const uri = uriFromEnv || 'mongodb://localhost:27017/' + dbName;

  try {
    await mongoose.connect(uri, {
      dbName,
    });
    console.log(`Connected to MongoDB (db: ${dbName})`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
