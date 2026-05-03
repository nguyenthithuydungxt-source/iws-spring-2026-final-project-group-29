const Exercise = require('../models/exerciseModel');
const MuscleGroup = require('../models/muscleGroupModel');
const WorkoutPlan = require('../models/workoutPlanModel');

// @desc    Create Exercise
exports.createExercise = async (req, res) => {
    try {
        const { name, sets, reps, weight, muscleGroup, workoutPlan } = req.body;

        // Bước 25: Kiểm tra thiếu trường
        if (!name || !sets || !reps || weight === undefined || !muscleGroup || !workoutPlan) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all required fields" 
            });
        }

        const muscle = await MuscleGroup.findById(muscleGroup);
        if (!muscle) return res.status(404).json({ success: false, message: 'Muscle Group not found' });

        const plan = await WorkoutPlan.findById(workoutPlan);
        if (!plan) return res.status(404).json({ success: false, message: 'Workout Plan not found' });

        req.body.creator = req.user.id;
        const exercise = await Exercise.create(req.body);
        
        res.status(201).json({ success: true, data: exercise });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get Exercises (Pagination & Sorting & Private)
exports.getExercises = async (req, res) => {
    try {
        // Khởi tạo query tìm theo người tạo (Private)
        const queryObj = { creator: req.user.id };

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const totalExercises = await Exercise.countDocuments(queryObj);
        const totalPages = Math.ceil(totalExercises / limit);

        let query = Exercise.find(queryObj);

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        query = query.skip(skip).limit(limit);

        const exercises = await query.populate('muscleGroup', 'name').populate('workoutPlan', 'title');

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPages,
            totalExercises,
            exercises
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Exercise By ID (Embeds Data via .populate())
exports.getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id)
            .populate('muscleGroup', 'name description') 
            .populate('workoutPlan', 'title goal');       

        if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

        // Bước 27: Check quyền sở hữu
        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden access' });
        }

        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid ID' });
    }
};

// @desc    Update Exercise
exports.updateExercise = async (req, res) => {
    try {
        let exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Exercise
exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });

        if (exercise.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Exercise.findByIdAndDelete(req.params.id);
        // Bước 29: Trả về message đúng yêu cầu
        res.status(200).json({ success: true, message: "Exercise removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};