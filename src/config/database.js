const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { connectDB };
