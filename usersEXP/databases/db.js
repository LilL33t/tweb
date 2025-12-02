const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/anime_db';

const connectDB =  async  () => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // fail fast if not reachable
        });
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1); // exit the process if DB connection fails
    }
}

module.exports = connectDB;