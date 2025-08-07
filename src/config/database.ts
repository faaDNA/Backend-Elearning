import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;

export const connectDB = async () => {
  try {
    if (!DATABASE_URL) {
      throw new Error('Database URL not found');
    }

    await mongoose.connect(DATABASE_URL);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
