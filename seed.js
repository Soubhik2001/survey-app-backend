require('dotenv').config();
const mongoose = require('mongoose');
const SurveyTemplate = require('./models/SurveyTemplate');

// Import the survey data from our new JSON file
const surveyData = require('./surveyData.json'); 

// Function to transform data and insert
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await SurveyTemplate.deleteMany({});
    console.log('Cleared old survey templates.');

    // The data is nested, so we map it to match our simple schema
    const templatesToInsert = surveyData.surveys.map(survey => ({
      title: survey.surveyData.title,
      surveyData: survey.surveyData // Store the entire surveyData object
    }));

    await SurveyTemplate.insertMany(templatesToInsert);
    console.log(`Successfully seeded ${templatesToInsert.length} survey templates.`);

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();