import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import NavBar from '../Components/NavBar';

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [escapeGame, setEscapeGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    numberOfPlayers: 1,
  });
  const [reservedSlots, setReservedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Créneaux horaires fixes : 9h-12h puis 14h-minuit, toutes les heures
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "00:00"
  ];

  useEffect(() => {
    const fetchEscapeGame = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/escape-games/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('Escape Game reçu :', response.data);
        setEscapeGame(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de l’escape game : ' + (err.response?.data || err.message));
        setLoading(false);
      }
    };
    fetchEscapeGame();
  }, [id, token]);

  useEffect(() => {
    const fetchReservedSlots = async () => {
      if (!reservation.date) return;
      try {
        const response = await axios.get('http://localhost:3000/api/reservations/timeslots', {
          params: { escapeGameId: id, date: reservation.date },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setReservedSlots(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des créneaux réservés :', err);
      }
    };
    fetchReservedSlots();
  }, [reservation.date, id, token]);

  const handleConfirmClick = () => {
    if (!reservation.date || !reservation.time || !reservation.numberOfPlayers) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (reservation.numberOfPlayers > escapeGame?.capacite_max) {
      setError(`Le nombre de participants ne peut pas dépasser ${escapeGame.capacite_max}.`);
      return;
    }
    if (reservedSlots.includes(reservation.time)) {
      setError('Ce créneau est déjà réservé.');
      return;
    }
    if (token && userId) {
      handleReserve();
    } else {
      setShowModal(true);
    }
  };

  const handleReserve = async () => {
    try {
      const dateTime = `${reservation.date}T${reservation.time}:00Z`;
      await axios.post(
        'http://localhost:3000/api/reservations',
        {
          escape_game_id: id,
          userId,
          date: dateTime,
          numberOfPlayers: reservation.numberOfPlayers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setError(null);
      setTimeout(() => navigate('/espace-client'), 2000);
    } catch (err) {
      setError('Erreur lors de la réservation : ' + (err.response?.data || err.message));
      setSuccess(false);
    }
  };

  const handleRegisterAndReserve = async (e) => {
    e.preventDefault();
    try {
      const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        mot_de_passe: password,
        name,
        firstName,
      });
      const { userId, token } = registerResponse.data;

      const dateTime = `${reservation.date}T${reservation.time}:00Z`;
      await axios.post(
        'http://localhost:3000/api/reservations',
        {
          escape_game_id: id,
          userId,
          date: dateTime,
          numberOfPlayers: reservation.numberOfPlayers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setError(null);
      setShowModal(false);
      setTimeout(() => navigate('/espace-client'), 2000);
    } catch (err) {
      setError('Erreur : ' + (err.response?.data?.error || err.message));
      setSuccess(false);
    }
  };

  if (loading) return <Container className="mt-5 pt-5"><div>Chargement...</div></Container>;
  if (error && !escapeGame) return <Container className="mt-5 pt-5"><div>Erreur : {error}</div></Container>;

  return (
    <div>
      <NavBar />
      <Container className="mt-5 pt-5">
        <h1>Réserver : {escapeGame?.nom}</h1>
        <p>
          <strong>Type :</strong> {escapeGame?.type} <br />
          <strong>Prix :</strong> {escapeGame?.prix} € <br />
          <strong>Capacité max :</strong> {escapeGame?.capacite_max} personnes
        </p>

        {success && <Alert variant="success">Réservation confirmée ! Redirection...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={reservation.date}
                  onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formTime">
                <Form.Label>Heure</Form.Label>
                <Form.Control
                  as="select"
                  value={reservation.time}
                  onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                  required
                >
                  <option value="">Choisir un horaire</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} disabled={reservedSlots.includes(slot)}>
                      {slot} {reservedSlots.includes(slot) ? '(Réservé)' : ''}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formParticipants">
                <Form.Label>Nombre de participants</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Participants"
                  value={reservation.numberOfPlayers}
                  onChange={(e) => setReservation({ ...reservation, numberOfPlayers: e.target.value })}
                  required
                  min="1"
                  max={escapeGame?.capacite_max || 6}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" onClick={handleConfirmClick}>
            Confirmer maintenant
          </Button>
        </Form>

        {/* Modale d’inscription */}
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
    </div>
  );
};

export default ReservationPage;