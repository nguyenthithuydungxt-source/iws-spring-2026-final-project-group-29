// Không dùng middleware protect (vì đề bài nói Public Access)
const express = require('express');
const router = express.Router();
const { 
    createMuscleGroup, 
    getMuscleGroups, 
    getMuscleGroupById, 
    updateMuscleGroup, 
    deleteMuscleGroup 
} = require('../controllers/muscleController');

router.route('/')
    .get(getMuscleGroups)
    .post(createMuscleGroup);

router.route('/:id')
    .get(getMuscleGroupById)
    .put(updateMuscleGroup)
    .delete(deleteMuscleGroup);

module.exports = router;