const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./src/config/database');
const app = require('./src/app');

// Ensure we establish the database connection during cold start on Vercel
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB', error);
  throw error;
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`JobSeek API listening on port ${PORT}`);
  });
}

module.exports = app;
