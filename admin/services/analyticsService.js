import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const getOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getAllUserScores = async () => {
  const res = await api.get("/analytics/users");
  return res.data;
};

export const getUserHistory = async (userId) => {
  const res = await api.get(`/analytics/users/${userId}`);
  return res.data;
};

export const getAllScenarios = async () => {
  const res = await api.get("/scenarios/all");
  return res.data;
};

export const seedScenarios = async () => {
  const res = await api.post("/scenarios/seed");
  return res.data;
};

export const createScenario = async (data) => {
  const res = await api.post("/scenarios", data);
  return res.data;
};

export const updateScenario = async (id, data) => {
  const res = await api.put(`/scenarios/${id}`, data);
  return res.data;
};

export const deleteScenario = async (id) => {
  const res = await api.delete(`/scenarios/${id}`);
  return res.data;
};


export const seedTrainingData = async () => {
  const res = await api.post("/training/seed");
  return res.data;
};

export const getQuestionStats = async () => {
  const res = await api.get("/training/question-stats");
  return res.data;
};

export const getAssessmentStats = async () => {
  const res = await api.get("/training/assessment-stats");
  return res.data;
};

export const seedPhishingData = async () => {
  const res = await api.post("/phishing/seed");
  return res.data;
};

export const getPhishingStats = async () => {
  const res = await api.get("/phishing/templates?labType=email");
  return res.data;
};
