import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  loginProfessor: (username, password) =>
    api.post('/auth/login', { username, password, tipo: 'professor' }),
  
  loginAdmin: (username, password) =>
    api.post('/auth/login', { username, password, tipo: 'admin' }),
  
  loginVisitante: () =>
    api.post('/auth/visitante'),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Public API (accessible to visitors)
export const publicAPI = {
  getCompetitions: () =>
    api.get('/competicoes'),
  
  getCompetition: (id) =>
    api.get(`/competicoes/${id}`),
  
  getGames: (params = {}) =>
    api.get('/jogos', { params }),
  
  getGame: (id) =>
    api.get(`/jogos/${id}`),
  
  getClassification: (competicaoId) =>
    api.get('/classificacao', { params: { competicaoId } }),
  
  getSchools: () =>
    api.get('/escolas'),
};

// Teacher API
export const teacherAPI = {
  getMyTeams: () =>
    api.get('/meus-times'),
  
  createTeam: (teamData) =>
    api.post('/times', teamData),
  
  updateTeam: (id, teamData) =>
    api.patch(`/times/${id}`, teamData),
  
  getMyGames: () =>
    api.get('/meus-jogos'),
  
  recordParticipation: (gameId, numeros) =>
    api.post(`/jogos/${gameId}/participacao`, { numeros }),
  
  createResource: (gameId, motivo) =>
    api.post(`/jogos/${gameId}/recursos`, { motivo }),
};

// Admin API
export const adminAPI = {
  // Competitions
  createCompetition: (data) =>
    api.post('/admin/competicoes', data),
  
  updateCompetition: (id, data) =>
    api.patch(`/admin/competicoes/${id}`, data),
  
  deleteCompetition: (id) =>
    api.delete(`/admin/competicoes/${id}`),
  
  // Schools
  createSchool: (data) =>
    api.post('/admin/escolas', data),
  
  updateSchool: (id, data) =>
    api.patch(`/admin/escolas/${id}`, data),
  
  deleteSchool: (id) =>
    api.delete(`/admin/escolas/${id}`),
  
  // Teachers
  getTeachers: () =>
    api.get('/admin/professores'),
  
  createTeacher: (data) =>
    api.post('/admin/professores', data),
  
  updateTeacher: (id, data) =>
    api.patch(`/admin/professores/${id}`, data),
  
  deleteTeacher: (id) =>
    api.delete(`/admin/professores/${id}`),
  
  resetTeacherPassword: (id) =>
    api.post(`/admin/professores/${id}/reset-password`),
  
  // Teams
  getAllTeams: () =>
    api.get('/admin/times'),
  
  createTeamAdmin: (data) =>
    api.post('/admin/times', data),
  
  updateTeamAdmin: (id, data) =>
    api.patch(`/admin/times/${id}`, data),
  
  deleteTeam: (id) =>
    api.delete(`/admin/times/${id}`),
  
  // Games
  getAllGames: () =>
    api.get('/admin/jogos'),
  
  createGame: (data) =>
    api.post('/admin/jogos', data),
  
  updateGame: (id, data) =>
    api.patch(`/admin/jogos/${id}`, data),
  
  generateGames: (competitionId) =>
    api.post('/admin/jogos/gerar', { competicaoId: competitionId }),
  
  // Resources
  getResources: () =>
    api.get('/admin/recursos'),
  
  updateResource: (id, data) =>
    api.patch(`/admin/recursos/${id}`, data),
};

export default api;

