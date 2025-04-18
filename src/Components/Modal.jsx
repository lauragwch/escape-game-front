import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForgotPasswordModal = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setStatus({
        type: 'success',
        message: response.data.message || 'Email envoyé avec succès! Vérifiez votre boîte de réception.'
      });
      setLoading(false);
    } catch (error) {
      setStatus({
        type: 'danger',
        message: error.response?.data?.message || 'Une erreur s\'est produite. Veuillez réessayer.'
      });
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mot de passe oublié</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status.message && <Alert variant={status.type}>{status.message}</Alert>}
        
        <p>
          Entrez votre adresse email ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
        
        <Form onSubmit={handleSubmit}>
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
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;