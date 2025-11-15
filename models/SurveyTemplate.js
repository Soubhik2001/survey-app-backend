const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveyTemplateSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    surveyData: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const SurveyTemplate = mongoose.model('SurveyTemplate', surveyTemplateSchema);

module.exports = SurveyTemplate;