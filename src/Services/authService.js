const authService = {
    isConnected: () => {
      return !!localStorage.getItem('token'); // Vérifie si un token existe
    },
    getRole: () => {
      return localStorage.getItem('role') || null; // Récupère le rôle
    },
    getUser: () => {
      return JSON.parse(localStorage.getItem('user')) || null; // Récupère l’utilisateur
    },
  };
  
  export default authService;