import { Card } from 'react-bootstrap';

const GameCard = ({ game }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title as="h3">{game.nom}</Card.Title>
        <Card.Text>
          <strong>Difficulté :</strong> {game.difficulte} <br />
          <strong>Durée :</strong> {game.duree} min <br />
          <strong>Prix :</strong> {game.prix}€ <br />
          <strong>Type :</strong> {game.type}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default GameCard;