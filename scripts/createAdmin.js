import User from '../models/userModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Use MONGO_URI instead of MONGODB_URI to match your .env file
const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected successfully to MongoDB');

        const admin = await User.create({
            name: 'Admin',
            email: 'godsEyes@toob.com',
            password: 'bigDaddyLol189374',
            role: 'admin'
        });

        console.log('Admin created successfully:', admin);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Add error handling for uncaught errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
    mongoose.connection.close().then(() => process.exit(1));
});

createAdmin();