const express = require('express');
const router = express.Router();
const { 
    createPlan, 
    getPlans, 
    getPlanById, 
    updatePlan, 
    deletePlan 
} = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');
const WorkoutPlan = require('../models/workoutPlan');

router.use(protect);

router.route('/')
    .get(getPlans)
    .post(createPlan);

router.route('/:id')
    .get(getPlanById)
    .put(authorizeOwnership(WorkoutPlan), updatePlan)
    .delete(authorizeOwnership(WorkoutPlan), deletePlan);

module.exports = router;