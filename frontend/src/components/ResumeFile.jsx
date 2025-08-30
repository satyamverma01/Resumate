import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Download,
  Save,
  Sparkles,
  Edit3,
  FileText,
  LogOut,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  Crown,
  Plus,
  Trash2,
  Calendar,
  Building,
} from "lucide-react";

//modal code
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-[#1C1C23] rounded-2xl shadow-lg border border-white/10"
      >
        {children}
      </div>
    </div>
  );
};

const ResumeFile = () => {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    phoneNumber: "",
    gmail: "",
    location: "",
    degree: "",
    institution: "",
    year: "",
    frontendSkills: "",
    backendSkills: "",
    description: "",
    workExperience: [],
    projects: [],
  });

  const [projectInput, setProjectInput] = useState("");
  const [aiGeneratedText, setAiGeneratedText] = useState("");
  const [editedResumeText, setEditedResumeText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedVersion, setLastSavedVersion] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false); //modal state

  const [workExpForm, setWorkExpForm] = useState({
    companyName: "",
    jobRole: "",
    duration: "",
    workDescription: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  // const userName = user?.name || "User";

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (editedResumeText !== lastSavedVersion && editedResumeText !== "") {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [editedResumeText, lastSavedVersion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkExpChange = (e) => {
    const { name, value } = e.target;
    setWorkExpForm((prev) => ({ ...prev, [name]: value }));
  };

  const addWorkExperience = () => {
    if (
      workExpForm.companyName.trim() &&
      workExpForm.jobRole.trim() &&
      workExpForm.duration.trim()
    ) {
      setFormData((prev) => ({
        ...prev,
        workExperience: [...prev.workExperience, { ...workExpForm }],
      }));
      setWorkExpForm({
        companyName: "",
        jobRole: "",
        duration: "",
        workDescription: "",
      });
    }
  };

  const removeWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const handleResumeTextChange = (e) => {
    setEditedResumeText(e.target.value);
  };

  const addProject = () => {
    if (projectInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, projectInput.trim()],
      }));
      setProjectInput("");
    }
  };

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // const handleBackToHome = () => {
  //   navigate("/");
  // };

  const generateAIText = async () => {
    setIsGenerating(true);

    try {
      if (
        !formData.name ||
        !formData.jobTitle ||
        !formData.phoneNumber ||
        !formData.gmail ||
        !formData.location ||
        (!formData.frontendSkills && !formData.backendSkills)
      ) {
        alert(
          "Please fill in all required fields: Name, Job Title, Phone Number, Email, Location, and at least one skill category (Frontend or Backend)"
        );
        setIsGenerating(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/docs/create",
        {
          name: formData.name,
          jobTitle: formData.jobTitle,
          phoneNumber: formData.phoneNumber,
          gmail: formData.gmail,
          location: formData.location,
          degree: formData.degree,
          institution: formData.institution,
          year: formData.year,
          frontendSkills: formData.frontendSkills,
          backendSkills: formData.backendSkills,
          description: formData.description,
          workExperience: formData.workExperience,
          projects: formData.projects,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      const generatedContent = data.newDoc.finalContent;
      setAiGeneratedText(generatedContent);
      setEditedResumeText(generatedContent);
      setLastSavedVersion(generatedContent);
      setShowPreview(true);
      setDocumentId(data.newDoc._id);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error generating AI text:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate resume";
      alert("Error generating resume: " + errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmRegenerate = async () => {
    setIsRegenerateModalOpen(false); // Close the modal first
    await generateAIText(); // Then run the generation logic
  };

  const saveChangesLocally = () => {
    setLastSavedVersion(editedResumeText);
    setAiGeneratedText(editedResumeText);
    setHasUnsavedChanges(false);

    const originalButton = document.querySelector("#save-button");
    if (originalButton) {
      const originalText = originalButton.innerHTML;
      originalButton.innerHTML =
        '<span class="flex items-center space-x-2"><span>✓</span><span>Saved!</span></span>';
      originalButton.classList.add("bg-green-600");
      originalButton.classList.remove("bg-indigo-600");

      setTimeout(() => {
        originalButton.innerHTML = originalText;
        originalButton.classList.remove("bg-green-600");
        originalButton.classList.add("bg-indigo-600");
      }, 2000);
    }
  };

  const discardChanges = () => {
    if (
      window.confirm(
        "Are you sure you want to discard your changes? This action cannot be undone."
      )
    ) {
      setEditedResumeText(lastSavedVersion);
      setHasUnsavedChanges(false);
    }
  };

  const regenerateWithCurrentData = async () => {
    if (
      window.confirm(
        "This will regenerate the resume with your current form data. Any manual edits will be lost. Continue?"
      )
    ) {
      await generateAIText();
    }
  };

  const formatResumeContent = (content) => {
    return content
      .replace(/\*/g, "")
      .replace(/^(\s*)-/gm, "• ")
      .replace(/^(\s*)([A-Z][^:]*):([^•\n]*)/gm, "<strong>$2:</strong>$3")
      .replace(/\n/g, "<br>");
  };

  const downloadPDF = () => {
    const currentResumeText = editedResumeText || aiGeneratedText;
    const formattedContent = formatResumeContent(currentResumeText);

    const workExpSection =
      formData.workExperience.length > 0
        ? formData.workExperience
            .map(
              (exp) => `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <div><strong>${exp.jobRole}</strong> | <em>${
                exp.companyName
              }</em></div>
            <div style="text-align: right;"><strong>${
              exp.duration
            }</strong></div>
          </div>
          <div style="margin-left: 10px;">• ${exp.workDescription.replace(
            /\n/g,
            "<br>• "
          )}</div>
        </div>
      `
            )
            .join("")
        : `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <div><strong>${formData.jobTitle}</strong></div>
            <div style="text-align: right;"><strong>Duration</strong></div>
          </div>
          <div style="margin-bottom: 5px;"><em>Company Name</em></div>
          <div>• Professional experience details</div>
        </div>
      `;

    const printContent = `
      <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.4; color: #000;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px; text-transform: uppercase;">${
            formData.name
          }</h1>
          <div style="margin-top: 8px; font-size: 12px;">
            <span>📞 ${formData.phoneNumber || "Phone Number"}</span> | 
            <span>✉️ ${
              formData.gmail ||
              formData.name.toLowerCase().replace(" ", "") + "@gmail.com"
            }</span> | 
            <span>📍 ${formData.location || "Location"}</span>
          </div>
        </div>
        
        ${
          formData.description
            ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">About Me</h2>
          <div style="font-size: 12px; text-align: justify; margin-left: 10px;">
            ${formData.description}
          </div>
        </div>
        `
            : ""
        }
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">Professional Summary</h2>
          <div style="font-size: 12px; text-align: justify; margin-left: 10px;">
            ${formattedContent}
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">Education</h2>
          <div style="font-size: 12px; margin-left: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${formData.degree || "Degree"}</strong><br>
                <em>${formData.institution || "Institution"}</em>
              </div>
              <div style="text-align: right;">
                <strong>${formData.year || "Year"}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">Work Experience</h2>
          <div style="font-size: 12px; margin-left: 10px;">
            ${workExpSection}
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">Projects</h2>
          <div style="font-size: 12px; margin-left: 10px;">
            ${
              formData.projects.length > 0
                ? formData.projects
                    .map((project) => `• ${project}`)
                    .join("<br>")
                : "• Project details will be listed here"
            }
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px;">Technical Skills</h2>
          <div style="font-size: 12px; margin-left: 10px;">
            ${
              formData.frontendSkills
                ? `<div><strong>Frontend:</strong> ${formData.frontendSkills}</div>`
                : ""
            }
            ${
              formData.backendSkills
                ? `<div><strong>Backend:</strong> ${formData.backendSkills}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${formData.name}</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print { 
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Download PDF</button>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const getFormProgress = () => {
    const requiredFields = [
      formData.name,
      formData.jobTitle,
      formData.phoneNumber,
      formData.gmail,
      formData.location,
      formData.frontendSkills || formData.backendSkills,
    ];
    const filledFields = requiredFields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const isFormComplete = () => {
    return (
      formData.name &&
      formData.jobTitle &&
      formData.phoneNumber &&
      formData.gmail &&
      formData.location &&
      (formData.frontendSkills || formData.backendSkills)
    );
  };

  const [username, setUsername] = useState("");
  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) {
      setUsername(name);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1929] text-white overflow-hidden relative">
      {/* Updated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gray-950"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-gray-950 to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.05),transparent_50%)]"></div>
      </div>

      {/* Updated Header */}
      <div className="relative z-10 bg-[#1A1929] backdrop-blur-sm border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600/80 p-2 rounded-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">
                      Resume Builder
                    </h1>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Create professional resumes with AI magic
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Welcome back,</span>
                <span className="text-indigo-400 font-medium">{username}</span>
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 bg-yellow-900/30 text-yellow-300 text-xs px-3 py-1 rounded-full border border-yellow-600/30">
                  <AlertCircle className="h-3 w-3" />
                  <span>Unsaved changes</span>
                </div>
              )}
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all duration-300 border border-gray-700/30 hover:border-gray-600/30"
                title="Logout"
              >
                <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Form Section */}
          <div className="relative">
            <div className="bg-[#1A1929] backdrop-blur-sm rounded-2xl border border-gray-800/40 p-6 shadow-xl space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="border-b border-gray-800/40 pb-4  bg-gray-900/60 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Edit3 className="h-5 w-5 mr-2 text-indigo-400" />
                      Resume Information
                    </h2>
                    <p className="text-gray-400 mt-1 text-sm">
                      Fill in your details to generate your professional resume
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getFormProgress()}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-indigo-400 font-semibold">
                        {getFormProgress()}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <User className="h-4 w-4" />
                  <span>Personal Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="gmail"
                      value={formData.gmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Patna, Bihar"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <GraduationCap className="h-4 w-4" />
                  <span>Education</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. B.Tech in Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. XYZ Institute of Technology"
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <Code className="h-4 w-4" />
                  <span>Technical Skills</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frontend Skills
                    </label>
                    <input
                      type="text"
                      name="frontendSkills"
                      value={formData.frontendSkills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. React, Vue.js, HTML, CSS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Backend Skills
                    </label>
                    <input
                      type="text"
                      name="backendSkills"
                      value={formData.backendSkills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Node.js, MongoDB, Express"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  * At least one skill category (Frontend or Backend) is
                  required
                </div>
              </div>

              {/* Personal Description */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <FileText className="h-4 w-4" />
                  <span>About You (Optional)</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Personal Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself, your goals, interests, or any additional information..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Optional: Add any additional information about yourself that
                    you'd like to include
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <Briefcase className="h-4 w-4" />
                  <span>Work Experience</span>
                </div>

                {/* Add Work Experience Form */}
                <div className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                    <Plus className="h-4 w-4 text-green-400" />
                    <span>Add Work Experience</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={workExpForm.companyName}
                        onChange={handleWorkExpChange}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="e.g. TechCorp India"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Role
                      </label>
                      <input
                        type="text"
                        name="jobRole"
                        value={workExpForm.jobRole}
                        onChange={handleWorkExpChange}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="e.g. Frontend Developer Intern"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={workExpForm.duration}
                      onChange={handleWorkExpChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="e.g. Jun 2024 - Dec 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Work Description
                    </label>
                    <textarea
                      name="workDescription"
                      value={workExpForm.workDescription}
                      onChange={handleWorkExpChange}
                      rows="2"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                      placeholder="Describe your responsibilities and achievements in this role..."
                    />
                  </div>

                  <button
                    onClick={addWorkExperience}
                    disabled={
                      !workExpForm.companyName.trim() ||
                      !workExpForm.jobRole.trim() ||
                      !workExpForm.duration.trim()
                    }
                    className="w-full bg-green-600/80 text-white py-2 px-4 rounded-lg hover:bg-green-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {/* Display Added Work Experiences */}
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {formData.workExperience.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-4 w-4 text-blue-400" />
                            <span className="font-medium text-white">
                              {exp.jobRole}
                            </span>
                            <span className="text-gray-400">at</span>
                            <span className="text-indigo-400 font-medium">
                              {exp.companyName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Calendar className="h-3 w-3" />
                            <span>{exp.duration}</span>
                          </div>
                          {exp.workDescription && (
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {exp.workDescription}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="text-red-400 hover:text-red-300 text-sm ml-4 p-2 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                          title="Remove experience"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-medium text-sm">
                  <Code className="h-4 w-4" />
                  <span>Projects</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addProject()}
                    className="flex-1 px-3 py-3 bg-gray-800/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Add a project"
                  />
                  <button
                    onClick={addProject}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800/20 p-3 rounded-lg border border-gray-700/30"
                    >
                      <span className="text-gray-300 flex-1">{project}</span>
                      <button
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300 text-sm ml-2 px-2 py-1 hover:bg-red-900/20 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4 border-t border-gray-800/40 space-y-3  bg-gray-900/60 backdrop-blur-sm">
                <button
                  onClick={generateAIText}
                  disabled={isGenerating || !isFormComplete()}
                  className="group relative w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating your resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Generate AI Resume</span>
                        <Zap className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </button>

                {showPreview && (
                  <button
                    // onClick={setIsRegenerateModalOpen(true)}
                    onClick={() => setIsRegenerateModalOpen(true)}
                    disabled={isGenerating}
                    className="w-full bg-gray-700/60 text-white py-3 px-4 rounded-lg hover:bg-gray-600/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-600/30 hover:border-gray-500/30"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate Resume</span>
                  </button>
                )}

                {!isFormComplete() && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Please fill in all required fields: Name, Job Title,
                        Phone Number, Email, Location, and at least one skill
                        category
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="relative ">
            <div className="bg-[#1A1929] backdrop-blur-sm rounded-2xl border  border-gray-800/40 p-6 shadow-xl">
              <div className="border-b border-gray-800/40 pb-4 mb-6 ">
                <div className="flex justify-between items-center ">
                  <div>
                    <h2 className="text-xl font-semibold text-white ">
                      Resume Preview
                    </h2>
                    <p className="text-gray-400 mt-1 text-sm">
                      Review and edit your generated resume
                    </p>
                  </div>
                  {hasUnsavedChanges && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 bg-yellow-900/30 text-yellow-300 text-xs px-3 py-1 rounded-full border border-yellow-600/30">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Unsaved changes</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* modal code */}

              <Modal
                isOpen={isRegenerateModalOpen}
                onClose={() => setIsRegenerateModalOpen(false)}
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-900/30 border border-yellow-600/30 mb-4">
                    <AlertCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-medium leading-6 text-white">
                    Regenerate Resume
                  </h3>
                  <div className="mt-2 px-4 py-3">
                    <p className="text-sm text-gray-400">
                      This will regenerate the resume with your current form
                      data. Any manual edits will be lost. Are you sure you want
                      to continue?
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsRegenerateModalOpen(false)}
                      className="w-full inline-flex justify-center rounded-md border border-gray-600/80 px-4 py-2 bg-gray-700/80 text-base font-medium text-white hover:bg-gray-600/80"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRegenerate}
                      className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              </Modal>

              {!showPreview ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                  <div className="relative mb-6">
                    <FileText className="h-20 w-20 text-gray-600" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <p className="text-xl mb-2 text-gray-300">
                    No resume generated yet
                  </p>
                  <p className="text-sm text-center max-w-xs">
                    Fill in your information and click "Generate AI Resume" to
                    create your professional resume
                  </p>
                </div>
              ) : (
                <div className="space-y-6 ">
                  <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4 ">
                    <div className="flex justify-between items-center mb-3 ">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-indigo-400" />
                        AI Generated Content
                      </h3>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <span>{editedResumeText.length} characters</span>
                        {hasUnsavedChanges && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <textarea
                      value={editedResumeText}
                      onChange={handleResumeTextChange}
                      rows="15"
                      className="w-full px-3 py-3 bg-gray-900/30 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm transition-all duration-200"
                      placeholder="AI generated resume content will appear here..."
                    />

                    <div className="mt-4 p-4 border border-gray-700/30 rounded-lg bg-gray-900/20">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        Formatted Preview:
                      </h4>
                      <div
                        className="text-sm prose prose-sm max-w-none text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatResumeContent(editedResumeText)
                            .replace(/•/g, "• ")
                            .replace(/\n\n/g, "<br><br>"),
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      id="save-button"
                      onClick={saveChangesLocally}
                      disabled={!hasUnsavedChanges}
                      className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>

                    <button
                      onClick={discardChanges}
                      disabled={!hasUnsavedChanges}
                      className="bg-gray-600/80 text-white py-3 px-4 rounded-lg hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-500/30"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Discard</span>
                    </button>

                    <button
                      onClick={downloadPDF}
                      disabled={!editedResumeText}
                      className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  {hasUnsavedChanges && (
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div>
                          <p className="text-yellow-200 text-sm font-medium mb-1">
                            You have unsaved changes
                          </p>
                          <p className="text-yellow-300/80 text-sm">
                            Click "Save Changes" to keep your edits or "Discard"
                            to revert to the last saved version.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle floating elements */}
      <div className="fixed top-32 right-20 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 left-20 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
      <div className="fixed top-1/2 left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>

      <style jsx>{`
        /* Custom scrollbar styling */
        textarea::-webkit-scrollbar,
        .max-h-40::-webkit-scrollbar,
        .max-h-32::-webkit-scrollbar,
        .max-h-\\[calc\\(100vh-200px\\)\\]::-webkit-scrollbar {
          width: 6px;
        }

        textarea::-webkit-scrollbar-track,
        .max-h-40::-webkit-scrollbar-track,
        .max-h-32::-webkit-scrollbar-track,
        .max-h-\\[calc\\(100vh-200px\\)\\]::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb,
        .max-h-40::-webkit-scrollbar-thumb,
        .max-h-32::-webkit-scrollbar-thumb,
        .max-h-\\[calc\\(100vh-200px\\)\\]::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb:hover,
        .max-h-40::-webkit-scrollbar-thumb:hover,
        .max-h-32::-webkit-scrollbar-thumb:hover,
        .max-h-\\[calc\\(100vh-200px\\)\\]::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ResumeFile;
