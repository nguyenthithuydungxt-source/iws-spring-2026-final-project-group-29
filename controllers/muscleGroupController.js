const MuscleGroup = require('../models/muscleGroupModel');

exports.createMuscleGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ success: false, message: "Please provide name and description" });
        }

        const muscleGroup = await MuscleGroup.create({ name, description });
        res.status(201).json({ success: true, data: muscleGroup });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ĐIỀU CHỈNH CHÍNH TẠI ĐÂY ĐỂ PHỤC VỤ BƯỚC 9
exports.getMuscleGroups = async (req, res) => {
    try {
        let query = {};

        // Kiểm tra nếu người dùng truyền "name" trong Body hoặc Query string để lọc
        const nameFilter = req.body.name || req.query.name;
        
        if (nameFilter) {
            // Sử dụng regex để tìm kiếm tương đối (ví dụ: "Body" sẽ khớp với "Upper Body")
            query.name = { $regex: nameFilter, $options: 'i' };
        }

        const muscleGroups = await MuscleGroup.find(query);

        // BƯỚC 9: Nếu có thực hiện lọc theo tên nhưng không tìm thấy bản ghi nào khớp
        if (nameFilter && muscleGroups.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Muscle group not found" 
            });
        }

        res.status(200).json({ success: true, count: muscleGroups.length, data: muscleGroups });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMuscleGroupById = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.findById(req.params.id);
        if (!muscleGroup) {
            return res.status(404).json({ success: false, message: "Muscle group not found" });
        }
        res.status(200).json({ success: true, data: muscleGroup });
    } catch (error) {
        // Trả về 404 cho cả trường hợp ID sai định dạng MongoDB
        res.status(404).json({ success: false, message: "Muscle group not found" });
    }
};

exports.updateMuscleGroup = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!muscleGroup) {
            return res.status(404).json({ success: false, message: "Muscle group not found" });
        }
        res.status(200).json({ success: true, data: muscleGroup });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteMuscleGroup = async (req, res) => {
    try {
        const muscleGroup = await MuscleGroup.findByIdAndDelete(req.params.id);
        if (!muscleGroup) {
            return res.status(404).json({ success: false, message: "Muscle group not found" });
        }
        res.status(200).json({ success: true, message: "Muscle group removed" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server Error" });
    }
};