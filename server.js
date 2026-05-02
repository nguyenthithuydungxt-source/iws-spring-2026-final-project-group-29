const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config(); // Kích hoạt biến môi trường
connectDB(); // Kết nối Database (Giang sẽ viết file này sau)

const app = express();
app.use(express.json()); // Để server đọc được dữ liệu JSON từ Postman gửi lên

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));