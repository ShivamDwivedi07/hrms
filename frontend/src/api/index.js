import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

export const getEmployees = () => api.get("/employees/");
export const createEmployee = (data) => api.post("/employees/", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deactivateEmployee = (id) =>
  api.patch(`/employees/${id}/deactivate`);
export const exportCSV = () =>
  api.get("/employees/export/csv", { responseType: "blob" });

export const getJobs = () => api.get("/recruitment/jobs");
export const createJob = (data) => api.post("/recruitment/jobs", data);
export const getCandidates = (jobId) =>
  api.get(`/recruitment/candidates/${jobId}`);
export const addCandidate = (jobId, formData) =>
  api.post(`/recruitment/candidates/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCandidateStage = (id, stage) =>
  api.patch(`/recruitment/candidates/${id}/stage`, null, { params: { stage } });

export const getLeaves = () => api.get("/leaves/");
export const applyLeave = (data) => api.post("/leaves/", data);
export const approveLeave = (id, comment) =>
  api.patch(`/leaves/${id}/approve`, null, { params: { comment } });
export const rejectLeave = (id, comment) =>
  api.patch(`/leaves/${id}/reject`, null, { params: { comment } });
export const markAttendance = (data) => api.post("/leaves/attendance", data);

export const getReviews = () => api.get("/performance/");
export const createReview = (data) => api.post("/performance/", data);
export const generateAIReview = (id) =>
  api.post(`/performance/${id}/generate-ai`);

export const uploadPolicyDoc = (formData) =>
  api.post("/onboarding/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const askChatbot = (question) =>
  api.post("/onboarding/chatbot", null, { params: { question } });
export const getOnboardingTasks = (empId) =>
  api.get(`/onboarding/tasks/${empId}`);
export const createTask = (data) => api.post("/onboarding/tasks", data);
export const completeTask = (id) =>
  api.patch(`/onboarding/tasks/${id}/complete`);

export const getAnalytics = () => api.get("/analytics/summary");
