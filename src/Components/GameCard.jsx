import '../Styles/GameCard.css';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <h3>{game.nom}</h3>
      <p>
        Difficulté : {game.difficulte} | Durée : {game.duree} min | Prix : {game.prix}€ | {game.type}
      </p>
    </div>
  );
};

export default GameCard;