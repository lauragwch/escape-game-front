import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        mot_de_passe,
      });
      const { token, userId, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      setError(null);
      navigate('/espace-client');
    } catch (err) {
      setError(err.response?.data || 'Erreur de connexion');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Connexion</h2>
      <form onSubmit={handleLogin} className="w-50 mx-auto">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="Entrez votre mot de passe"
            value={mot_de_passe}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;