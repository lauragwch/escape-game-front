import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const ProfilPage = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState({
    email: '',
    name: '',
    firstName: '',
    phoneNumber: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // États pour contrôler la visibilité des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) {
      window.location.href = '/login';
      return;
    }

    const fetchUserData = async () => {
      console.log(`Récupération des informations pour l'utilisateur ID: ${userId}`);
      try {
        const response = await axios.get(`http://localhost:3000/api/clients/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
 
        setUser({
          email: response.data.email || '',
          name: response.data.name || '',
          firstName: response.data.firstName || '',
          phoneNumber: response.data.phoneNumber || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Erreur complète:', error);

        const errorMessage = error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Erreur inconnue';    

        setMessage({
          type: 'danger',
          text: 'Erreur lors du chargement des informations: ' + (error.response?.data?.message || error.message)
        });
        setLoading(false);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      }
    };

    fetchUserData();
  }, [token, userId]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/clients/${userId}`, {
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
    } catch (error) {
      setMessage({
        type: 'danger',
        text: 'Erreur lors de la mise à jour: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'danger', text: 'Les mots de passe ne correspondent pas!' });
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/clients/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordMessage({
        type: 'danger',
        text: 'Erreur lors de la modification du mot de passe: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar />
        <Container className="mt-5 pt-5">
          <p>Chargement des informations...</p>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Container className="mt-5 pt-5">
        <h1 className="text-center mb-4">Mon Profil</h1>
        
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header as="h5">Informations Personnelles</Card.Header>
              <Card.Body>
                {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                
                <Form onSubmit={handleProfileUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.firstName}
                      onChange={(e) => setUser({...user, firstName: e.target.value})}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={user.phoneNumber}
                      onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                    />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" className="w-100">
                    Mettre à jour
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Modifier le mot de passe</Card.Header>
              <Card.Body>
                {passwordMessage.text && <Alert variant={passwordMessage.type}>{passwordMessage.text}</Alert>}
                
                <Form onSubmit={handlePasswordChange}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mot de passe actuel</Form.Label>
                    <InputGroup>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" className="w-100">
                    Changer le mot de passe
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilPage;