const API_URL = 'http://localhost:3000/api';

export const fetchEscapeGames = async () => {
  const response = await fetch(`${API_URL}/escape-games`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des escape games');
  return response.json();
};