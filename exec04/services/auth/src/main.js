import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { User } from './schedule.js';
import dotenv from 'dotenv';
dotenv.config({ path: '/app/.env' });
console.log("load all env", process.env);
const app = express();
app.use(express.json());
const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const mongoDbUri = process.env.MONGO_DB;
if (!mongoDbUri) {
    throw new Error('MONGO_DB environment variable is not set');
}
async function startServer() {
    try {
        await mongoose.connect(mongoDbUri);
        console.log('Mongoose connected to MongoDB');
        app.listen(port, '0.0.0.0', () => {
            console.log(`Example app listening on port ${port}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    const apiKey = crypto.randomBytes(32).toString('hex');
    try {
        const user = new User({ email, password, apiKey });
        await user.save();
        res.status(201).json({ id: user.id, email: user.email, apiKey: user.apiKey });
    }
    catch (err) {
        res.status(500).json({ error: 'Error creating user', details: err });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        res.status(200).json({ id: user.id, email: user.email, apiKey: user.apiKey });
    }
    catch (err) {
        res.status(500).json({ error: 'Error logging in', details: err });
    }
});
startServer();
