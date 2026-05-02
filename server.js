const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

// 1. Load the vault secrets into the Node.js environment variables process
dotenv.config();

// 2. Execute the asynchronous database connection function
connectDB();

// 3. Initialize the Express application framework
const app = express();

// 4. Middleware
app.use(express.json());

// 5. Mount the Routers
// We define the base URLs. Any request to '/api/auth' is handed to authRoutes.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use('/api/auth', authRoutes);

// 6. Define the port and start the server engine
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`>>> TaskFlow API Server successfully running on port ${PORT}`);
});