const mongoose = require('mongoose');

const muscleGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a muscle group name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the muscle group'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    }
}, { timestamps: true });

module.exports = mongoose.model('MuscleGroup', muscleGroupSchema);