import * as mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, require: true },
}, {
    methods: {},
});
export const User = mongoose.model('User', UserSchema);
