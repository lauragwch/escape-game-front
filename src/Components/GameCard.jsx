import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title as="h3">{game.nom}</Card.Title>
        <Card.Text>
          <strong>Difficulté :</strong> {game.difficulte} <br />
          <strong>Durée :</strong> {game.duree} min <br />
          <strong>Prix :</strong> {game.prix} € <br />
          <strong>Type :</strong> {game.type}
        </Card.Text>
        <Button as={Link} to={`/reservation/${game.id}`} variant="primary">
          Réserver
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GameCard;