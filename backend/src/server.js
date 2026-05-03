const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

/**
 * ✅ CORS CONFIG (robust)
 */
const corsOptions = {
  origin: '*', // change to frontend URL if using credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

/**
 * ✅ Body parser
 */
app.use(express.json());

/**
 * ✅ DB connection
 */
connectDB();

/**
 * ✅ Test route (for debugging CORS)
 */
app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working ✅' });
});

/**
 * ✅ Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

/**
 * ❗ 404 handler (important)
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/**
 * ❗ Error handler (must include CORS headers)
 */
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
  });
});

/**
 * ✅ Server start
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});