const WorkoutPlan = require('../models/workoutPlan');

exports.createPlan = async (req, res) => {
    try {
        req.body.creator = req.user.id;
        const plan = await WorkoutPlan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ creator: req.user.id });
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

        if (plan.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Server Error' });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        let plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

        if (plan.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

        if (plan.creator.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await WorkoutPlan.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};