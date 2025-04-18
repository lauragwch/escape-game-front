import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, InputGroup, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
    <Container className="mt-5 pt-5">
      <div className="d-flex justify-content-center">
        <Card style={{ width: '450px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Connexion</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    value={mot_de_passe}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Se connecter
              </Button>
              
              <div className="text-center mt-3">
                <Link to="/mot-de-passe-oublie" className="text-decoration-none">
                  Mot de passe oublié ?
                </Link>
                </div>
              
              <div className="text-center mt-3">
                <span>Pas encore de compte ? </span>
                <Link to="/inscription" className="text-decoration-none">
                  Créer un compte
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default LoginPage;