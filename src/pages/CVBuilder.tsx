import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CVData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
  
  // Professional Summary
  professionalTitle: string;
  yearsOfExperience: string;
  careerObjective: string;
  
  // Education
  highestDegree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
  gpa: string;
  relevantCoursework: string;
  academicAchievements: string;
  certifications: string;
  
  // Work Experience
  currentJobTitle: string;
  currentCompany: string;
  currentJobDuration: string;
  currentJobResponsibilities: string;
  currentJobAchievements: string;
  
  previousJob1Title: string;
  previousJob1Company: string;
  previousJob1Duration: string;
  previousJob1Responsibilities: string;
  previousJob1Achievements: string;
  
  previousJob2Title: string;
  previousJob2Company: string;
  previousJob2Duration: string;
  previousJob2Responsibilities: string;
  previousJob2Achievements: string;
  
  // Skills
  technicalSkills: string;
  softSkills: string;
  languages: string;
  tools: string;
  frameworks: string;
  databases: string;
  cloudPlatforms: string;
  
  // Projects
  project1Name: string;
  project1Description: string;
  project1Technologies: string;
  project1Link: string;
  
  project2Name: string;
  project2Description: string;
  project2Technologies: string;
  project2Link: string;
  
  project3Name: string;
  project3Description: string;
  project3Technologies: string;
  project3Link: string;
  
  // Additional Information
  volunteerExperience: string;
  publications: string;
  awards: string;
  professionalMemberships: string;
  conferences: string;
  hobbies: string;
  
  // Career Goals
  shortTermGoals: string;
  longTermGoals: string;
  desiredIndustry: string;
  desiredRole: string;
  willingToRelocate: string;
  expectedSalary: string;
  availabilityDate: string;
  
  // References
  reference1Name: string;
  reference1Title: string;
  reference1Company: string;
  reference1Contact: string;
  
  reference2Name: string;
  reference2Title: string;
  reference2Company: string;
  reference2Contact: string;
}

const steps = [
  {
    title: "Personal Information",
    description: "Let's start with your basic details",
    fields: ["fullName", "email", "phone", "location", "linkedIn", "portfolio"]
  },
  {
    title: "Professional Summary",
    description: "Tell us about your professional identity",
    fields: ["professionalTitle", "yearsOfExperience", "careerObjective"]
  },
  {
    title: "Education",
    description: "Your academic background",
    fields: ["highestDegree", "fieldOfStudy", "university", "graduationYear", "gpa", "relevantCoursework", "academicAchievements", "certifications"]
  },
  {
    title: "Current Position",
    description: "Your current or most recent job",
    fields: ["currentJobTitle", "currentCompany", "currentJobDuration", "currentJobResponsibilities", "currentJobAchievements"]
  },
  {
    title: "Previous Experience #1",
    description: "Your second most recent position",
    fields: ["previousJob1Title", "previousJob1Company", "previousJob1Duration", "previousJob1Responsibilities", "previousJob1Achievements"]
  },
  {
    title: "Previous Experience #2",
    description: "Another previous position",
    fields: ["previousJob2Title", "previousJob2Company", "previousJob2Duration", "previousJob2Responsibilities", "previousJob2Achievements"]
  },
  {
    title: "Technical Skills",
    description: "Your technical expertise",
    fields: ["technicalSkills", "tools", "frameworks", "databases", "cloudPlatforms"]
  },
  {
    title: "Soft Skills & Languages",
    description: "Your interpersonal skills and languages",
    fields: ["softSkills", "languages"]
  },
  {
    title: "Projects",
    description: "Showcase your best work",
    fields: ["project1Name", "project1Description", "project1Technologies", "project1Link", "project2Name", "project2Description", "project2Technologies", "project2Link", "project3Name", "project3Description", "project3Technologies", "project3Link"]
  },
  {
    title: "Additional Experience",
    description: "Volunteer work, publications, and awards",
    fields: ["volunteerExperience", "publications", "awards", "professionalMemberships", "conferences"]
  },
  {
    title: "Career Goals",
    description: "Where do you want to go?",
    fields: ["shortTermGoals", "longTermGoals", "desiredIndustry", "desiredRole", "willingToRelocate", "expectedSalary", "availabilityDate"]
  },
  {
    title: "References",
    description: "Professional references",
    fields: ["reference1Name", "reference1Title", "reference1Company", "reference1Contact", "reference2Name", "reference2Title", "reference2Company", "reference2Contact"]
  },
  {
    title: "Personal Interests",
    description: "Round out your profile",
    fields: ["hobbies"]
  }
];

const fieldLabels: Record<keyof CVData, string> = {
  fullName: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  location: "City, Country",
  linkedIn: "LinkedIn Profile URL",
  portfolio: "Portfolio/Website URL",
  professionalTitle: "Professional Title (e.g., Senior Software Engineer)",
  yearsOfExperience: "Years of Experience",
  careerObjective: "Career Objective (2-3 sentences about your career goals)",
  highestDegree: "Highest Degree",
  fieldOfStudy: "Field of Study",
  university: "University/Institution",
  graduationYear: "Graduation Year",
  gpa: "GPA (if applicable)",
  relevantCoursework: "Relevant Coursework",
  academicAchievements: "Academic Achievements",
  certifications: "Certifications (comma-separated)",
  currentJobTitle: "Current Job Title",
  currentCompany: "Current Company",
  currentJobDuration: "Duration (e.g., Jan 2020 - Present)",
  currentJobResponsibilities: "Key Responsibilities (one per line)",
  currentJobAchievements: "Key Achievements (one per line)",
  previousJob1Title: "Job Title",
  previousJob1Company: "Company",
  previousJob1Duration: "Duration",
  previousJob1Responsibilities: "Key Responsibilities",
  previousJob1Achievements: "Key Achievements",
  previousJob2Title: "Job Title",
  previousJob2Company: "Company",
  previousJob2Duration: "Duration",
  previousJob2Responsibilities: "Key Responsibilities",
  previousJob2Achievements: "Key Achievements",
  technicalSkills: "Technical Skills (comma-separated)",
  softSkills: "Soft Skills (comma-separated)",
  languages: "Languages & Proficiency (e.g., English - Native, Spanish - Fluent)",
  tools: "Tools & Software (comma-separated)",
  frameworks: "Frameworks & Libraries (comma-separated)",
  databases: "Databases (comma-separated)",
  cloudPlatforms: "Cloud Platforms (comma-separated)",
  project1Name: "Project Name",
  project1Description: "Project Description",
  project1Technologies: "Technologies Used",
  project1Link: "Project Link/GitHub URL",
  project2Name: "Project Name",
  project2Description: "Project Description",
  project2Technologies: "Technologies Used",
  project2Link: "Project Link/GitHub URL",
  project3Name: "Project Name",
  project3Description: "Project Description",
  project3Technologies: "Technologies Used",
  project3Link: "Project Link/GitHub URL",
  volunteerExperience: "Volunteer Experience",
  publications: "Publications",
  awards: "Awards & Honors",
  professionalMemberships: "Professional Memberships",
  conferences: "Conferences Attended",
  hobbies: "Hobbies & Interests",
  shortTermGoals: "Short-term Career Goals (1-2 years)",
  longTermGoals: "Long-term Career Goals (5+ years)",
  desiredIndustry: "Desired Industry",
  desiredRole: "Desired Role",
  willingToRelocate: "Willing to Relocate?",
  expectedSalary: "Expected Salary Range",
  availabilityDate: "Availability Date",
  reference1Name: "Reference Name",
  reference1Title: "Reference Title",
  reference1Company: "Reference Company",
  reference1Contact: "Reference Contact (Email/Phone)",
  reference2Name: "Reference Name",
  reference2Title: "Reference Title",
  reference2Company: "Reference Company",
  reference2Contact: "Reference Contact (Email/Phone)"
};

export default function CVBuilder() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const createAnalysis = useMutation(api.careersync.createCVAnalysis);
  const analyzeCV = useAction(api.aiAnalysis.analyzeCV);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  const [cvData, setCvData] = useState<CVData>({
    fullName: "", email: "", phone: "", location: "", linkedIn: "", portfolio: "",
    professionalTitle: "", yearsOfExperience: "", careerObjective: "",
    highestDegree: "", fieldOfStudy: "", university: "", graduationYear: "", gpa: "",
    relevantCoursework: "", academicAchievements: "", certifications: "",
    currentJobTitle: "", currentCompany: "", currentJobDuration: "",
    currentJobResponsibilities: "", currentJobAchievements: "",
    previousJob1Title: "", previousJob1Company: "", previousJob1Duration: "",
    previousJob1Responsibilities: "", previousJob1Achievements: "",
    previousJob2Title: "", previousJob2Company: "", previousJob2Duration: "",
    previousJob2Responsibilities: "", previousJob2Achievements: "",
    technicalSkills: "", softSkills: "", languages: "", tools: "", frameworks: "",
    databases: "", cloudPlatforms: "",
    project1Name: "", project1Description: "", project1Technologies: "", project1Link: "",
    project2Name: "", project2Description: "", project2Technologies: "", project2Link: "",
    project3Name: "", project3Description: "", project3Technologies: "", project3Link: "",
    volunteerExperience: "", publications: "", awards: "", professionalMemberships: "",
    conferences: "", hobbies: "",
    shortTermGoals: "", longTermGoals: "", desiredIndustry: "", desiredRole: "",
    willingToRelocate: "", expectedSalary: "", availabilityDate: "",
    reference1Name: "", reference1Title: "", reference1Company: "", reference1Contact: "",
    reference2Name: "", reference2Title: "", reference2Company: "", reference2Contact: ""
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleInputChange = (field: keyof CVData, value: string) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateCVText = (): string => {
    return `
CURRICULUM VITAE

PERSONAL INFORMATION
Name: ${cvData.fullName}
Email: ${cvData.email}
Phone: ${cvData.phone}
Location: ${cvData.location}
LinkedIn: ${cvData.linkedIn}
Portfolio: ${cvData.portfolio}

PROFESSIONAL SUMMARY
${cvData.professionalTitle} with ${cvData.yearsOfExperience} years of experience.
${cvData.careerObjective}

EDUCATION
${cvData.highestDegree} in ${cvData.fieldOfStudy}
${cvData.university}, ${cvData.graduationYear}
GPA: ${cvData.gpa}
Relevant Coursework: ${cvData.relevantCoursework}
Academic Achievements: ${cvData.academicAchievements}
Certifications: ${cvData.certifications}

WORK EXPERIENCE
${cvData.currentJobTitle} at ${cvData.currentCompany}
${cvData.currentJobDuration}
Responsibilities: ${cvData.currentJobResponsibilities}
Achievements: ${cvData.currentJobAchievements}

${cvData.previousJob1Title} at ${cvData.previousJob1Company}
${cvData.previousJob1Duration}
Responsibilities: ${cvData.previousJob1Responsibilities}
Achievements: ${cvData.previousJob1Achievements}

${cvData.previousJob2Title} at ${cvData.previousJob2Company}
${cvData.previousJob2Duration}
Responsibilities: ${cvData.previousJob2Responsibilities}
Achievements: ${cvData.previousJob2Achievements}

SKILLS
Technical Skills: ${cvData.technicalSkills}
Tools: ${cvData.tools}
Frameworks: ${cvData.frameworks}
Databases: ${cvData.databases}
Cloud Platforms: ${cvData.cloudPlatforms}
Soft Skills: ${cvData.softSkills}
Languages: ${cvData.languages}

PROJECTS
${cvData.project1Name}: ${cvData.project1Description}
Technologies: ${cvData.project1Technologies}
Link: ${cvData.project1Link}

${cvData.project2Name}: ${cvData.project2Description}
Technologies: ${cvData.project2Technologies}
Link: ${cvData.project2Link}

${cvData.project3Name}: ${cvData.project3Description}
Technologies: ${cvData.project3Technologies}
Link: ${cvData.project3Link}

ADDITIONAL INFORMATION
Volunteer Experience: ${cvData.volunteerExperience}
Publications: ${cvData.publications}
Awards: ${cvData.awards}
Professional Memberships: ${cvData.professionalMemberships}
Conferences: ${cvData.conferences}
Hobbies: ${cvData.hobbies}

CAREER GOALS
Short-term: ${cvData.shortTermGoals}
Long-term: ${cvData.longTermGoals}
Desired Industry: ${cvData.desiredIndustry}
Desired Role: ${cvData.desiredRole}
Willing to Relocate: ${cvData.willingToRelocate}
Expected Salary: ${cvData.expectedSalary}
Availability: ${cvData.availabilityDate}

REFERENCES
${cvData.reference1Name}, ${cvData.reference1Title} at ${cvData.reference1Company}
Contact: ${cvData.reference1Contact}

${cvData.reference2Name}, ${cvData.reference2Title} at ${cvData.reference2Company}
Contact: ${cvData.reference2Contact}
    `.trim();
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Generating your CV...");

    try {
      const cvText = generateCVText();
      const blob = new Blob([cvText], { type: "text/plain" });
      
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: blob,
      });
      
      const { storageId } = await result.json();

      const analysisId = await createAnalysis({
        fileName: `${cvData.fullName.replace(/\s+/g, "_")}_CV.txt`,
        fileStorageId: storageId,
        extractedText: cvText,
      });

      toast.success("CV created! Analyzing...");

      await analyzeCV({
        analysisId,
        extractedText: cvText,
      });

      toast.success("Analysis complete!");
      navigate(`/analysis/${analysisId}`);
    } catch (error) {
      console.error("CV generation error:", error);
      toast.error("Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="CareerSync" className="h-8 w-8" />
              <span className="font-bold text-xl">AI CV Builder</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {currentStepData.title}
                </CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStepData.fields.map((field) => {
                  const fieldKey = field as keyof CVData;
                  const isTextarea = field.includes("Responsibilities") || 
                                    field.includes("Achievements") || 
                                    field.includes("Description") ||
                                    field.includes("Objective") ||
                                    field.includes("Goals") ||
                                    field.includes("Experience") ||
                                    field.includes("Coursework");
                  
                  return (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{fieldLabels[fieldKey]}</Label>
                      {field === "willingToRelocate" ? (
                        <Select
                          value={cvData[fieldKey]}
                          onValueChange={(value) => handleInputChange(fieldKey, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="maybe">Open to discussion</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : isTextarea ? (
                        <Textarea
                          id={field}
                          value={cvData[fieldKey]}
                          onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          placeholder={`Enter your ${fieldLabels[fieldKey].toLowerCase()}`}
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={field}
                          value={cvData[fieldKey]}
                          onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          placeholder={`Enter your ${fieldLabels[fieldKey].toLowerCase()}`}
                        />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Generate My CV
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
