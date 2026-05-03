const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');


dotenv.config();

connectDB();


const app = express();


app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plan', require('./routes/workoutPlanRoutes'));
app.use('/api/musclegroups', require('./routes/muscleGroupRoutes') );
app.use('/api/excercise', require('./routes/exerciseRoutes') );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> TaskFlow API Server successfully running on port ${PORT}`);
});