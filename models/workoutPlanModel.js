const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a workout plan title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    goal: {
        type: String,
        required: [true, 'Please specify a goal (e.g., Weight Loss, Muscle Gain)'],
        maxlength: [500, 'Goal description cannot exceed 500 characters']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

workoutPlanSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'workoutPlan',
    justOne: false
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);