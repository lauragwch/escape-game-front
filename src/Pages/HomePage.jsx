import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Ajouté pour les liens
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import GameCard from '../Components/GameCard';
import { fetchEscapeGames } from '../Services/api';
import '../Styles/HomePage.css';

const HomePage = () => {
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

  if (loading) return <Container className="mt-5"><div>Chargement...</div></Container>;
  if (error) return <Container className="mt-5"><div>Erreur : {error}</div></Container>;

  return (
    <Container className="mt-5 homepage">
      <section className="presentation">
        <Card>
          <Card.Body>
            <Card.Title as="h1">Bienvenue chez Escape Adventure</Card.Title>
            <h2>Qui sommes-nous ?</h2>
            <Card.Text>
              Escape Adventure est une entreprise passionnée par les expériences immersives. Nous proposons des escape games uniques, sur site ou à domicile, pour tous les amateurs de défis et d’énigmes. Que vous soyez en famille, entre amis ou en équipe, venez vivre une aventure inoubliable !
            </Card.Text>
          </Card.Body>
        </Card>
      </section>

      <section className="escape-games mt-4">
        <h2>Nos Escape Games</h2>
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
      </section>

      <section className="mini-games mt-4">
        <Card>
          <Card.Body>
            <Card.Title as="h2">Mini-Jeux Thématiques</Card.Title>
            <Card.Text>
              Envie d’un avant-goût ? Essayez nos mini-jeux en ligne (bientôt disponibles) :
            </Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item><a href="#">Énigmes du Manoir (à venir)</a></ListGroup.Item>
              <ListGroup.Item><a href="#">Défis Nomades (à venir)</a></ListGroup.Item>
              <ListGroup.Item><a href="#">Trésors Cachés (à venir)</a></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
};

export default HomePage;