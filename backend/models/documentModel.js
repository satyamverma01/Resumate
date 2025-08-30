const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  jobTitle: {
    type: String,
    required: true,
  },

  personalInfo: [
    {
      phoneNumber: {
        type: String,
        required: true,
      },
      gmail: { type: String, required: true },
      location: { type: String, required: true },
    },
  ],

  education: [
    {
      degree: {
        type: String,
        required: true,
      },
      institution: { type: String, required: true },
      year: { type: String, required: true },
    },
  ],

  skills: [
    {
      frontendSkills: { type: String},
      backendSkills:{ type: String },
      workExperience: { type: String},
    },
  ],
  projects: [String],

  finalContent: { type: String, required: true },
});

const documentModel = mongoose.model("Documents", documentSchema);

module.exports = documentModel;
