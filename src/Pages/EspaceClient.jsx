import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const EspaceClient = () => {
  const [reservations, setReservations] = useState([]);
  const [escapeGames, setEscapeGames] = useState([]);
  const [error, setError] = useState(null);
  const [newReservation, setNewReservation] = useState({
    escapeGameId: '',
    date: '',
    time: '',
    numberOfPlayers: '',
  });
  const [editReservation, setEditReservation] = useState(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Créneaux horaires fixes : 9h-12h puis 14h-minuit, toutes les heures
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "00:00"
  ];

  // Fonction pour obtenir le tarif en fonction de l'ID de l'escape game
  const getPrice = (escapeGameId) => {
    const game = escapeGames.find((g) => g.id === parseInt(escapeGameId, 10));
    return game?.prix || 0;
  };

  // Fonction pour obtenir le tarif à partir de la réservation
  const getReservationPrice = (reservation) => {
    return reservation.escape_game_type === 'Sur site' ? 100 : reservation.escape_game_type === 'À domicile' ? 180 : 0;
  };

  useEffect(() => {
    if (token && userId) {
      fetchReservations();
      fetchEscapeGames();
    }
  }, [token, userId]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/reservations/client/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Réservations reçues (détail) :', JSON.stringify(response.data, null, 2));
      setReservations(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des réservations : ' + (err.response?.data || err.message));
    }
  };

  const fetchEscapeGames = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/escape-games', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Escape Games reçus :', response.data); // Vérifie que capacite_max est inclus
      setEscapeGames(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des escape games : ' + (err.response?.data || err.message));
    }
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    const game = escapeGames.find(g => g.id === parseInt(newReservation.escapeGameId));
    if (!game || newReservation.numberOfPlayers > game.capacite_max) {
      setError(`Le nombre de participants ne peut pas dépasser ${game?.capacite_max || 'la capacité maximale'}.`);
      return;
    }
    try {
      const dateTime = `${newReservation.date}T${newReservation.time}:00Z`;
      await axios.post(
        'http://localhost:3000/api/reservations',
        { 
          escape_game_id: newReservation.escapeGameId, 
          date: dateTime, 
          nombre_participants: newReservation.numberOfPlayers, 
          userId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewReservation({ escapeGameId: '', date: '', time: '', numberOfPlayers: '' });
      fetchReservations();
    } catch (err) {
      setError('Erreur lors de l’ajout : ' + (err.response?.data || err.message));
    }
  };

  const handleEditReservation = async (id) => {
    const game = escapeGames.find(g => g.id === reservations.find(r => r.id === id).escape_game_id);
    if (!game || editReservation.nombre_participants > game.capacite_max) {
      setError(`Le nombre de participants ne peut pas dépasser ${game?.capacite_max || 'la capacité maximale'}.`);
      return;
    }
    try {
      const dateTime = `${editReservation.date_reservation}T${editReservation.time}:00Z`;
      await axios.put(
        `http://localhost:3000/api/reservations/${id}`,
        { date_reservation: dateTime, nombre_participants: editReservation.nombre_participants },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditReservation(null);
      fetchReservations();
    } catch (err) {
      setError('Erreur lors de la modification : ' + (err.response?.data || err.message));
    }
  };

  const handleCancel = async (id) => {
    try {
      console.log('Envoi de l’annulation pour ID:', id);
      const response = await axios.put(
        `http://localhost:3000/api/reservations/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Réponse du serveur (annulation):', response.data);
      fetchReservations();
    } catch (err) {
      setError('Erreur lors de l’annulation : ' + (err.response?.data || err.message));
      console.error('Erreur annulation:', err.response?.data || err);
    }
  };

  if (!token || !userId) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mon Espace Client</h1>

      <h3>Ajouter une réservation</h3>
      <form onSubmit={handleAddReservation} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <select
              className="form-select"
              value={newReservation.escapeGameId}
              onChange={(e) => setNewReservation({ ...newReservation, escapeGameId: e.target.value })}
              required
            >
              <option value="">Choisir un Escape Game</option>
              {escapeGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.nom} (max {game.capacite_max} pers.)
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={newReservation.date}
              onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={newReservation.time}
              onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
              required
            >
              <option value="">Heure</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Participants"
              value={newReservation.numberOfPlayers}
              onChange={(e) => setNewReservation({ ...newReservation, numberOfPlayers: e.target.value })}
              required
              min="1"
              max={escapeGames.find(g => g.id === parseInt(newReservation.escapeGameId))?.capacite_max || 6}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              value={newReservation.escapeGameId ? `${getPrice(newReservation.escapeGameId)} €` : 'N/A'}
              readOnly
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-success w-100">Ajouter</button>
          </div>
        </div>
      </form>

      <h3>Mes Réservations</h3>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Escape Game</th>
              <th>Date</th>
              <th>Participants</th>
              <th>Tarif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.escape_game_nom}</td>
                <td>{res.date_reservation}</td>
                <td>{res.nombre_participants}</td>
                <td>{getReservationPrice(res)} €</td>
                <td>{res.statut}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      const date = res.date_reservation.split('T')[0];
                      const time = res.date_reservation.split('T')[1].substring(0, 5);
                      setEditReservation({ id: res.id, date_reservation: date, time, nombre_participants: res.nombre_participants });
                    }}
                  >
                    Modifier
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(res.id)}>
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editReservation && (
        <div className="mt-4">
          <h3>Modifier la réservation #{editReservation.id}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditReservation(editReservation.id);
            }}
          >
            <div className="row">
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control mb-2"
                  value={editReservation.date_reservation}
                  onChange={(e) => setEditReservation({ ...editReservation, date_reservation: e.target.value })}
                />
                <select
                  className="form-select"
                  value={editReservation.time}
                  onChange={(e) => setEditReservation({ ...editReservation, time: e.target.value })}
                >
                  <option value="">Heure</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  value={editReservation.nombre_participants}
                  onChange={(e) => setEditReservation({ ...editReservation, nombre_participants: e.target.value })}
                  min="1"
                  max={escapeGames.find(g => g.id === reservations.find(r => r.id === editReservation.id).escape_game_id)?.capacite_max || 6}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  value={`${getReservationPrice(reservations.find(res => res.id === editReservation.id))} €`}
                  readOnly
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary me-2">Sauvegarder</button>
                <button className="btn btn-secondary" onClick={() => setEditReservation(null)}>Annuler</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {error && <p className="text-danger mt-3">{error}</p>}
      <button
        className="btn btn-outline-danger mt-3"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default EspaceClient;