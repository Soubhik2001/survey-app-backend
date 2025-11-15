const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveyTemplateSchema = new Schema({
    // e.g., "Student Daily Habits Survey"
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Stores the entire flexible JSON schema for the survey
    // (sections, questions, logic, etc.)
    surveyData: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const SurveyTemplate = mongoose.model('SurveyTemplate', surveyTemplateSchema);

module.exports = SurveyTemplate;