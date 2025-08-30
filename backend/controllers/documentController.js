const Document = require("../models/documentModel.js");
const generateWithGemini = require("../utils/geminiGenerate.js");

//create document

const createDoc = async (req, res) => {
  try {
    const { jobTitle, degree, institution, year, skillname, workExperience, projects, name } = req.body;

    const aiGeneratedContent = await generateWithGemini(
      // name,
      jobTitle,
      workExperience,
      skillname,
      
    );

    const document = new Document({
      user: req.user._id,
      jobTitle,
      education: [
        {
          degree,
          institution,
          year,
        },
      ],
      skills: [
        {
          skillname,
        },
      ],
      projects,
      finalContent: aiGeneratedContent,
    });

    const newDoc = await document.save();
    res.status(201).json({ message: "Document created successfully", newDoc });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error while saving to DB", error });
  }
};
//fetch docs

const fetchDoc = async (req, res) => {
  try {
    const fetchDocs = await Document.find({ user: req.user._id });
    res.status(201).json({ message: "Docs fetched successfully", fetchDocs });
  } catch (error) {
    res.status(400).json({ message: "error while fetching to db", error });
  }
};

//update

const updateDoc = async (req, res) => {
  try {
    const updateDocs = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updateDocs) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(201).json({ message: "Docs updated successfully", updateDocs });
  } catch (error) {
    res.status(400).json({ message: "error while updating data to db", error });
  }
};

//delete

const deleteDoc = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(201).json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "error while deleting document to db", error });
  }
};

module.exports = { createDoc, fetchDoc, updateDoc, deleteDoc };
