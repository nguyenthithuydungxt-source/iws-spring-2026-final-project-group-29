const express = require('express');
const router = express.Router();
const { 
    createMuscleGroup, 
    getMuscleGroups, 
    getMuscleGroupById, 
    updateMuscleGroup, 
    deleteMuscleGroup 
} = require('../controllers/muscleGroupController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getMuscleGroups)
    .post(protect, createMuscleGroup);

router.route('/:id')
    .get(getMuscleGroupById)
    .put(protect, updateMuscleGroup)
    .delete(protect, deleteMuscleGroup);

module.exports = router;