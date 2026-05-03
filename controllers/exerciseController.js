const Exercise = require('../models/exerciseModel');
const MuscleGroup = require('../models/muscleGroupModel');
const WorkoutPlan = require('../models/workoutPlanModel');

// @desc    Create Exercise
exports.createExercise = async (req, res) => {
    try {
        const muscle = await MuscleGroup.findById(req.body.muscleGroup);
        if (!muscle) return res.status(404).json({ message: 'Muscle Group not found' });

        req.body.creator = req.user.id;
        const exercise = await Exercise.create(req.body);
        res.status(201).json({ success: true, data: exercise });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Exercises (Pagination & Sorting & Private)
exports.getExercises = async (req, res) => {
    try {
        let query = Exercise.find({ creator: req.user.id });

        // SORTING
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt');
        }

        // PAGINATION
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        const exercises = await query;
        res.status(200).json({
            success: true,
            count: exercises.length,
            pagination: { page, limit },
            data: exercises
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Exercise By ID (Embeds Data via .populate())
exports.getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id)
            .populate('muscleGroup', 'name description') 
            .populate('workoutPlan', 'title goal');       

        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden access' });
        }

        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID' });
    }
};

exports.updateExercise = async (req, res) => {
    try {
        let exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Exercise.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};