const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Xác thực Token JWT
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // BƯỚC 15 & 24: Yêu cầu lỗi 401 với thông báo cụ thể
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        next();
    } catch (error) {
        // Trả về 401 cho các trường hợp token sai hoặc hết hạn
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, token failed' 
        });
    }
};

// @desc    Kiểm tra quyền sở hữu tài nguyên (WorkoutPlan, Exercise, v.v.)
exports.authorizeOwnership = (model) => async (req, res, next) => {
    try {
        const resource = await model.findById(req.params.id);

        if (!resource) {
            // Đồng nhất lỗi không tìm thấy tài nguyên
            const modelName = model.modelName === 'WorkoutPlan' ? 'Plan' : 'Exercise';
            return res.status(404).json({ 
                success: false, 
                message: `${modelName} not found` 
            });
        }


        const isOwner = resource.creator.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: This is not your workout plan' 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};