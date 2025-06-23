import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { User, Survey, SurveyResponse } from './schedule';
import type { Request, Response, NextFunction } from 'express';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';

const app = express();
app.use(express.json());
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const mongoDbUri = process.env.MONGO_DB;
if (!mongoDbUri) {
  throw new Error('MONGO_DB environment variable is not set');
}

type UserDoc = Document & {
  _id: Types.ObjectId;
  email: string;
  password: string;
  apiKey?: string;
};

// Extender la interfaz Request para incluir 'user' como documento de usuario
declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

async function startServer() {
  try {
    await mongoose.connect(mongoDbUri!);
    console.log('Mongoose connected to MongoDB');

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
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
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  User.findOne({ apiKey: token })
    .then((user: any) => {
      if (!user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
      req.user = user;
      next();
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Authentication error', details: err });
    });
}

// Crear una nueva encuesta
app.post('/survey', authenticate, (req: Request, res: Response): void => {
  const { title, description, questions } = req.body;
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    res.status(400).json({ error: 'Title and questions are required' });
    return;
  }
  const survey = new Survey({ title, description, questions });
  survey.save()
    .then((saved: any) => {
      res.status(201).json(saved);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Error creating survey', details: err });
    });
});

// Eliminar una encuesta
app.delete('/survey/:id', authenticate, (req: Request, res: Response): void => {
  const { id } = req.params;
  Survey.findByIdAndDelete(id)
    .then((deleted: any) => {
      if (!deleted) {
        res.status(404).json({ error: 'Survey not found' });
        return;
      }
      res.status(200).json({ message: 'Survey deleted' });
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Error deleting survey', details: err });
    });
});

// Agregar respuesta a una encuesta (sin autenticación)
app.post('/survey/:id/response', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { answers, userId } = req.body;
  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ error: 'Answers are required' });
    return;
  }
  Survey.findById(id)
    .then((survey: any) => {
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
    .then((saved: any) => {
      if (saved) res.status(201).json(saved);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Error saving response', details: err });
    });
});

startServer();

