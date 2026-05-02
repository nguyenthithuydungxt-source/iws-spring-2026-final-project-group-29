const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: Date
    },
    height: {
        type: Number // cm
    },
    currentWeight: {
        type: Number // kg
    },
    fitnessGoal: {
        type: String,
        enum: ['Lose weight', 'Gain weight', 'Maintain weight', 'Build muscle'],
        default: 'Maintain weight'
    },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'lightly active', 'moderately active', 'very active'],
        default: 'lightly active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);