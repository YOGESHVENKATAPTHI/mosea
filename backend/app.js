// app.js – Bootstraps the Express server, loads env variables, enables CORS, and mounts routes.
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Debug: print loaded environment variables to ensure .env is working
console.log('[ENV]', {
  PORT: process.env.PORT,
  ACCOUNT_API_KEY: !!process.env.ACCOUNT_API_KEY,
  ACCOUNT_WORKSPACE_ID: process.env.ACCOUNT_WORKSPACE_ID,
  HISTORY_API_KEY: !!process.env.HISTORY_API_KEY,
  HISTORY_WORKSPACE_ID: process.env.HISTORY_WORKSPACE_ID
});

// Enable CORS (only allow your React app; adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Parse incoming JSON bodies
app.use(bodyParser.json());

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Mount content routes
app.use('/api/content', contentRoutes);

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));