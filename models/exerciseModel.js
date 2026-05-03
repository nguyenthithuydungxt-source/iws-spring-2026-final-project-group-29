const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide exercise name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    sets: {
        type: Number,
        required: [true, 'Please provide number of sets']
    },
    reps: {
        type: Number,
        required: [true, 'Please provide number of reps']
    },
    weight: {
        type: Number,
        required: [true, 'Please provide weight']
    },
    muscleGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MuscleGroup',
        required: [true, 'Please provide muscle group']
    },
    workoutPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutPlan',
        required: [true, 'Please provide workout plan']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Exercise', exerciseSchema);