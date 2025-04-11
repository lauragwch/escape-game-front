import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import GameCard from '../Components/GameCard';
import { fetchEscapeGames } from '../Services/api';
import '../Styles/HomePage.css'; // Réutilisons ce CSS pour le moment

const EscapeGamesPage = () => {
  const [escapeGames, setEscapeGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEscapeGames = async () => {
      try {
        const data = await fetchEscapeGames();
        setEscapeGames(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadEscapeGames();
  }, []);

  if (loading) return <Container className="mt-5 pt-5"><div>Chargement...</div></Container>;
  if (error) return <Container className="mt-5 pt-5"><div>Erreur : {error}</div></Container>;

  return (
    <div>
      <NavBar />
      <Container className="mt-5 pt-5">
        <h1>Nos Escape Games</h1>
        <Row xs={1} md={2} lg={3} className="g-4">
          {escapeGames.length > 0 ? (
            escapeGames.map(game => (
              <Col key={game.id}>
                <Link to={`/escape-game/${game.id}`} style={{ textDecoration: 'none' }}>
                  <GameCard game={game} />
                </Link>
              </Col>
            ))
          ) : (
            <Col><p>Aucun escape game disponible pour le moment.</p></Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default EscapeGamesPage;