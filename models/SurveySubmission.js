const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveySubmissionSchema = new Schema({
    surveyTemplate: {
        type: Schema.Types.ObjectId,
        ref: 'SurveyTemplate',
        required: true
    },
    // Store the user's answers as a flexible key-value object.
    // e.g., { "q_1": "John Doe", "q_2": "3rd", "q_3": "Yes" }
    answers: {
        type: Schema.Types.Mixed,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const SurveySubmission = mongoose.model('SurveySubmission', surveySubmissionSchema);

module.exports = SurveySubmission;