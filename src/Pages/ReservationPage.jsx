import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [players, setPlayers] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Nom (ex. : nom de famille)
  const [firstName, setFirstName] = useState(''); // Prénom ajouté
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleConfirmClick = () => {
    setShowModal(true);
  };

  const handleRegisterAndReserve = async (e) => {
    e.preventDefault();
    try {
      const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        mot_de_passe: password, // "password" est la valeur du champ du formulaire
        name,
        firstName,
      });
      const { userId, token } = registerResponse.data;
      console.log('Token généré par register :', token);
  
      const reservationData = {
        escapeGameId: id,
        userId,
        date: date.toISOString(),
        numberOfPlayers: players,
      };
      console.log('Envoi de la réservation avec token :', token);
      await axios.post('http://localhost:3000/api/reservations', reservationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setSuccess(true);
      setError(null);
      setShowModal(false);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Erreur : ' + (err.response?.data?.error || err.message));
      setSuccess(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Réserver l’Escape Game #{id}</h1>
      {success && <Alert variant="success">Réservation confirmée ! Redirection...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date et heure</Form.Label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="dd/MM/yyyy HH:mm"
                className="form-control"
                minDate={new Date()}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="players">
              <Form.Label>Nombre de joueurs</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleConfirmClick}>
          Confirmer maintenant
        </Button>
      </Form>

      {/* Modale d’inscription avec Prénom */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterAndReserve}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              S’inscrire et réserver
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReservationPage;