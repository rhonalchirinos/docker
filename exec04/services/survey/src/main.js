import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { User, Survey, SurveyResponse } from './schedule.js';
import { Types } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '/app/.env' });
console.log("load all env", process.env);
const app = express();
app.use(express.json());
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
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
// Middleware para verificar el token y obtener el usuario
function authenticate(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    User.findOne({ apiKey: token })
        .then((user) => {
        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        req.user = user;
        next();
    })
        .catch((err) => {
        res.status(500).json({ error: 'Authentication error', details: err });
    });
}
// Crear una nueva encuesta
app.post('/survey', authenticate, (req, res) => {
    const { title, description, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        res.status(400).json({ error: 'Title and questions are required' });
        return;
    }
    const survey = new Survey({ title, description, questions });
    survey.save()
        .then((saved) => {
        res.status(201).json(saved);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Error creating survey', details: err });
    });
});
// Eliminar una encuesta
app.delete('/survey/:id', authenticate, (req, res) => {
    const { id } = req.params;
    Survey.findByIdAndDelete(id)
        .then((deleted) => {
        if (!deleted) {
            res.status(404).json({ error: 'Survey not found' });
            return;
        }
        res.status(200).json({ message: 'Survey deleted' });
    })
        .catch((err) => {
        res.status(500).json({ error: 'Error deleting survey', details: err });
    });
});
// Agregar respuesta a una encuesta (sin autenticación)
app.post('/survey/:id/response', (req, res) => {
    const { id } = req.params;
    const { answers, userId } = req.body;
    if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ error: 'Answers are required' });
        return;
    }
    Survey.findById(id)
        .then((survey) => {
        if (!survey) {
            res.status(404).json({ error: 'Survey not found' });
            return null;
        }
        // Si el usuario está autenticado, puede enviar su userId en el body, si no, será undefined
        const response = new SurveyResponse({
            surveyId: id,
            userId: userId || undefined,
            answers,
        });
        return response.save();
    })
        .then((saved) => {
        if (saved)
            res.status(201).json(saved);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Error saving response', details: err });
    });
});
startServer();
