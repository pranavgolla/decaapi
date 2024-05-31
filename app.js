const express = require('express');
const connectDB = require('./utils/db');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Log environment variables to verify they are loaded correctly
// console.log('MONGO_URI:', process.env.MONGO_URI);
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
 
const app = express();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  