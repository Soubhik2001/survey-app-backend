const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const SurveyTemplate = mongoose.model('SurveyTemplate');
const SurveySubmission = mongoose.model('SurveySubmission');

const router = express.Router();

/**
 * Endpoint 1: GET /api/weather
 * Fetches 3-day forecast for a given city.
 * We'll use the Open-Meteo API (no key required!)
 */
router.get('/weather', async (req, res) => {
  const { city } = req.query;

  // 1. Get coordinates for the city (using Open-Meteo's geocoding)
  if (!city) {
    return res.status(400).json({ error: 'City query parameter is required.' });
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'City not found.' });
    }

    const { latitude, longitude, name } = geoResponse.data.results[0];

    // 2. Get the 3-day forecast for those coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3`;
    const weatherResponse = await axios.get(weatherUrl);

    res.json({
      city: name,
      forecast: weatherResponse.data.daily
    });

  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

/**
 * Endpoint 2: GET /api/surveys
 * Gets a list of all available survey templates for the dashboard.
 */
router.get('/surveys', async (req, res) => {
  try {
    // We only select the 'title' and the '_id' (which Mongoose includes by default)
    const surveys = await SurveyTemplate.find({}, 'title'); 
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch surveys.' });
  }
});

/**
 * Endpoint 3: GET /api/surveys/:id
 * Gets the full JSON data for a single survey to render the form.
 */
router.get('/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid survey ID format.' });
    }

    const survey = await SurveyTemplate.findById(id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found.' });
    }
    // Send back the full survey data
    res.json(survey); 
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch survey.' });
  }
});

/**
 * Endpoint 4: POST /api/surveys/:id/submit
 * Saves a user's completed survey submission.
 */
router.post('/surveys/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid survey ID format.' });
    }

    // Check if the template exists
    const templateExists = await SurveyTemplate.findById(id);
    if (!templateExists) {
      return res.status(404).json({ error: 'Survey template not found.' });
    }

    // Create new submission
    const newSubmission = new SurveySubmission({
      surveyTemplate: id,
      answers: answers // Store the { q_1: "...", q_2: "..." } object
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Submission saved successfully.' });

  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to save submission.' });
  }
});

/**
 * Endpoint 5: GET /api/submissions
 * Gets all submissions, grouped by survey template.
 */
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await SurveySubmission.find({})
      .populate('surveyTemplate', 'title'); // Replaces the 'surveyTemplate' ID with the full object, but only selects its 'title'

    // Group the submissions by survey title
    const grouped = submissions.reduce((acc, sub) => {
      const title = sub.surveyTemplate ? sub.surveyTemplate.title : 'Unknown Survey';
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(sub);
      return acc;
    }, {});

    res.json(grouped);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

module.exports = router;