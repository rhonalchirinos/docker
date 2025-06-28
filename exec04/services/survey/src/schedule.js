import * as mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, require: true },
});
export const User = mongoose.model('User', UserSchema);
// Survey Schema
const SurveySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: [{
            text: { type: String, required: true },
            type: { type: String, required: true }, // e.g. 'text', 'multiple-choice', etc.
            options: [{ type: String }], // Opciones para preguntas tipo opción múltiple
        }],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
});
export const Survey = mongoose.model('Survey', SurveySchema);
// SurveyResponse Schema
const SurveyResponseSchema = new mongoose.Schema({
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Opcional para respuestas anónimas
    answers: [{
            questionIndex: { type: Number, required: true },
            answer: { type: mongoose.Schema.Types.Mixed, required: true }, // Puede ser string o array
        }],
    submittedAt: { type: Date, default: Date.now },
    userAgent: { type: String },
    ip: { type: String },
    responseTimeMs: { type: Number },
});
export const SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);
