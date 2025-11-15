require('dotenv').config();
const mongoose = require('mongoose');
const SurveyTemplate = require('./models/SurveyTemplate');

// Import the survey data from our new JSON file
const surveyData = require('./surveyData.json'); 

/**
 * This script is run one time (node seed.js) to populate the database.
 * It clears existing data and inserts the 3 surveys from surveyData.json.
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await SurveyTemplate.deleteMany({});
    console.log('Cleared old survey templates.');

    // Map the raw data to match our schema
    const templatesToInsert = surveyData.surveys.map(survey => ({
      title: survey.surveyData.title,
      surveyData: survey.surveyData
    }));

    // Insert new data
    await SurveyTemplate.insertMany(templatesToInsert);
    console.log(`Successfully seeded ${templatesToInsert.length} survey templates.`);

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the seed function
seedDB();