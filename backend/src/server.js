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

const allowedOrigins = [
	process.env.CORS_ORIGIN,
	process.env.FRONTEND_URL,
	'http://localhost:5173',
	'http://localhost:3000',
	'https://*.vercel.app',
].filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		if (!origin) {
			return callback(null, true);
		}

		const isAllowed = allowedOrigins.some((allowedOrigin) => {
			if (allowedOrigin === 'https://*.vercel.app') {
				return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
			}

			return allowedOrigin === origin;
		});

		return isAllowed
			? callback(null, true)
			: callback(new Error('CORS blocked for this origin'));
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
