const WorkoutPlan = require('../models/workoutPlanModel');

// @desc    Create new workout plan
// @route   POST /api/plans
exports.createPlan = async (req, res) => {
    try {
        req.body.creator = req.user.id;
        const plan = await WorkoutPlan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all plans for logged in user (Strictly Private)
// @route   GET /api/plans
exports.getPlans = async (req, res) => {
    try {
        // Chỉ lấy những plan do chính user hiện tại tạo ra
        const plans = await WorkoutPlan.find({ creator: req.user.id })
            .populate({ path: 'creator', select: 'name email' });
            
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single plan by ID
// @route   GET /api/plans/:id
exports.getPlanById = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id)
            .populate({ path: 'creator', select: 'name email' });

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        if (plan.creator._id.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: This is not your workout plan' 
            });
        }

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
exports.updatePlan = async (req, res) => {
    try {
        let plan = await WorkoutPlan.findById(req.params.id);
        
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

      
        if (plan.creator.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: This is not your workout plan' 
            });
        }

        plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
exports.deletePlan = async (req, res) => {
    try {
        const plan = await WorkoutPlan.findById(req.params.id);
        
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

        if (plan.creator.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: This is not your workout plan' 
            });
        }

        await WorkoutPlan.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};