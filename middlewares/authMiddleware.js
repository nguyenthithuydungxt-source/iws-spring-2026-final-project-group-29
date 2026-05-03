const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Session expired or token is invalid. Please log in again.' });
    }
},
exports.authorizeOwnership = (model) => async (req, res, next) => {
    try {
        const resource = await model.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        if (resource.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: `User ${req.user.id} is not authorized to update/delete this resource` 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};