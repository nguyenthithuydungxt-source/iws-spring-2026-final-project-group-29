const express = require('express');
const router = express.Router();
const { 
    createExercise, 
    getExercises, 
    getExerciseById, 
    updateExercise, 
    deleteExercise 
} = require('../controllers/exerciseController');
const { protect, authorizeOwnership } = require('../middleware/authMiddleware');
const Exercise = require('../models/exerciseModel'); 

router.use(protect); 

router.route('/')
    .get(getExercises)
    .post(createExercise);

router.route('/:id')
    .get(getExerciseById)

    .put(authorizeOwnership(Exercise), updateExercise) 
    .delete(authorizeOwnership(Exercise), deleteExercise);

module.exports = router;