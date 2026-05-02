const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Requires Token)
exports.createTask = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Get all tasks belonging to the logged-in user (with Pagination & Sorting)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const reqQuery = { user: req.user.id };
        if (req.query.status) reqQuery.status = req.query.status;
        if (req.query.priority) reqQuery.priority = req.query.priority;

        let query = Task.find(reqQuery);

        // 2. SORTING LOGIC EXECUTION
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt');
        }

        // 3. PAGINATION LOGIC EXECUTION
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const startIndex = (page - 1) * limit;

        query = query.skip(startIndex).limit(limit);

        // 4. Final Execution
        const tasks = await query;

        const total = await Task.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: tasks.length,
            pagination: { currentPage: page, limit, totalPages: Math.ceil(total / limit) },
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error during fetching tasks' });
    }
};
// @desc    Update a specific task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found in the database' });

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a specific task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found in the database' });

        // --- ADVANCED AUTHORIZATION (403 Forbidden) ---
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};