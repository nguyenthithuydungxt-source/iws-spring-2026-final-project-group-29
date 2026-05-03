const MuscleGroup = require('../models/muscleGroup');

// @desc    Create Muscle Group
// @route   POST /api/musclegroups
// @access  Public
exports.createMuscleGroup = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.create(req.body);
        res.status(201).json({ success: true, data: muscleGroup });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all Muscle Groups
// @route   GET /api/musclegroups
exports.getMuscleGroups = async (req, res) => {
    try {
        const muscleGroups = await MuscleGroup.find();
        res.status(200).json({ success: true, count: muscleGroups.length, data: muscleGroups });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Single Muscle Group
// @route   GET /api/musclegroups/:id
exports.getMuscleGroupById = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.findById(req.params.id);
        if (!muscleGroup) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: muscleGroup });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid ID' });
    }
};

// @desc    Update Muscle Group
// @route   PUT /api/musclegroups/:id
exports.updateMuscleGroup = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: muscleGroup });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete Muscle Group
// @route   DELETE /api/musclegroups/:id
exports.deleteMuscleGroup = async (req, res) => {
    try {
        await MuscleGroup.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Server Error' });
    }
};