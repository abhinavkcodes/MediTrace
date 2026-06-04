// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const medicineRoutes = require('./routes/medicines');
const purchaseRoutes = require('./routes/purchase');
const storeRoutes = require('./routes/stores');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from build output if available
const frontendFolder = path.join(__dirname, '..', 'frontend');
const frontendDist = path.join(frontendFolder, 'dist');
const staticFolder = fs.existsSync(frontendDist) ? frontendDist : frontendFolder;
app.use(express.static(staticFolder));

// API Routes
app.use('/api', medicineRoutes);
app.use('/api', storeRoutes);
app.use('/api', purchaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Root endpoint - serve index.html from build or source
app.get('/', (req, res) => {
  const indexFile = path.join(staticFolder, 'index.html');
  res.sendFile(indexFile);
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Catch-all: serve frontend for non-API routes
app.get('*', (req, res) => {
  const indexFile = path.join(staticFolder, 'index.html');
  res.sendFile(indexFile);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/health`);
  console.log(`💻 Frontend: http://localhost:${PORT}/`);
  console.log(`📋 API Base: http://localhost:${PORT}/api/medicines\n`);
});

module.exports = app;
