require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import models to register them with Mongoose
require('./models/SurveyTemplate');
require('./models/SurveySubmission');

// Import API routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());   // To parse incoming JSON payloads

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');

    // Start the server ONLY after the DB connection is successful
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


// --- API Routes ---
// Use the routes defined in routes/api.js for any URL starting with /api
app.use('/api', apiRoutes);

// Simple base route
app.get('/', (req, res) => {
  res.send('Backend server is running and connected to DB!');
});