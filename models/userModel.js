const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        maxlength: 15,
        select: false
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
