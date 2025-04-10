import React, { useEffect, useState } from 'react'; // Plus besoin de useContext
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Badge, ListGroup } from 'react-bootstrap';

const EscapeGamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [escapeGame, setEscapeGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscapeGame = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/escape-games/${id}`);
        setEscapeGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération de l’Escape Game :', error);
        setLoading(false);
      }
    };
    fetchEscapeGame();
  }, [id]);

  const handleReservation = () => {
    navigate(`/reservation/${id}`); // Redirection sans condition
  };

  if (loading) return <Container className="mt-5"><p>Chargement...</p></Container>;
  if (!escapeGame) return <Container className="mt-5"><p>Escape Game non trouvé</p></Container>;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Img
          variant="top"
          src={escapeGame.photo || 'https://via.placeholder.com/600x400'}
          alt={escapeGame.nom}
        />
        <Card.Body>
          <Card.Title as="h1">
            {escapeGame.nom}
            {escapeGame.type === 'À domicile' && (
              <Badge bg="warning" className="ms-2">À domicile</Badge>
            )}
          </Card.Title>
          <Card.Text as="div">
            <h3>Description</h3>
            <p>{escapeGame.description}</p>
            <h4>Détails</h4>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Durée :</strong> {escapeGame.duree} minutes</ListGroup.Item>
              <ListGroup.Item><strong>Difficulté :</strong> {escapeGame.difficulte}</ListGroup.Item>
              <ListGroup.Item><strong>Prix par personne :</strong> {escapeGame.prix} €</ListGroup.Item>
              <ListGroup.Item><strong>Capacité max :</strong> {escapeGame.capacite_max} joueurs</ListGroup.Item>
            </ListGroup>
            {escapeGame.type === 'À domicile' && (
              <>
                <h4 className="mt-4">Informations pour les Escape Games à domicile</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Livraison du kit :</strong> Si applicable, le kit est livré à votre adresse sous 48h après confirmation de la réservation (frais de livraison : 5€).
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Configuration à domicile :</strong> Suivez les instructions incluses dans le kit. Préparez un espace de 2m² minimum, une table, et un accès internet pour les indices numériques.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Assistance en ligne :</strong> Une hotline est disponible au 01 23 45 67 89 ou via chat sur notre site pendant votre session.
                  </ListGroup.Item>
                </ListGroup>
              </>
            )}
          </Card.Text>
          <Button variant="primary" className="mt-3" onClick={handleReservation}>
            Réserver maintenant
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EscapeGamePage;