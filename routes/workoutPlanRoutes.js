const express = require('express');
const router = express.Router();
const { 
    createPlan, 
    getPlans, 
    getPlanById, 
    updatePlan, 
    deletePlan 
} = require('../controllers/workoutPlanController');


const { protect, authorizeOwnership } = require('../middlewares/authMiddleware');
const WorkoutPlan = require('../models/workoutPlanModel');


router.use(protect);

router.route('/')
    .get(getPlans)   
    .post(createPlan); 

router.route('/:id')
    .get(getPlanById) 
    .put(authorizeOwnership(WorkoutPlan), updatePlan)   
    .delete(authorizeOwnership(WorkoutPlan), deletePlan); 

module.exports = router;