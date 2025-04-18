import { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../Components/NavBar';
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
  
  return (
    <div className="home-page-wrapper">
      <NavBar />
      
      <div className="hero-banner">
        <div className="overlay"></div>
        <Container className="hero-content">
          <h1>Bienvenue chez Énigmes Évadées</h1>
          <p>Plongez dans des aventures extraordinaires et relevez des défis palpitants</p>
          <Button 
            as={Link} 
            to="/escape-games" 
            variant="primary" 
            size="lg"
            className="mt-3"
          >
            Découvrir nos escape games
          </Button>
        </Container>
      </div>
      
      <Container className="mt-5 homepage">
        <section className="presentation">
          <Card>
            <Card.Body>
              <Card.Title as="h2">Qui sommes-nous ?</Card.Title>
              <Card.Text>
                Énigmes Évadées est une entreprise passionnée par les expériences immersives. Nous proposons des escape games uniques, sur site ou à domicile, pour tous les amateurs de défis et d'énigmes. Que vous soyez en famille, entre amis ou en équipe, venez vivre une aventure inoubliable !
              </Card.Text>
            </Card.Body>
          </Card>
        </section>

        <section className="discover-games mt-4">
          <Card>
            <Card.Body>
              <Card.Title as="h2">Découvrez Nos Escape Games</Card.Title>
              <Card.Text>
                Plongez dans des univers captivants et testez vos compétences avec nos escape games uniques. Sur site ou à domicile, il y en a pour tous les goûts !
              </Card.Text>
              {loading ? (
                <p>Chargement des escape games...</p>
              ) : error ? (
                <p>Erreur lors du chargement des escape games: {error}</p>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4 mb-3">
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
              )}
            </Card.Body>
          </Card>
        </section>

        <section className="mini-games mt-4">
          <Card>
            <Card.Body>
              <Card.Title as="h2">Mini-Jeux Thématiques</Card.Title>
              <Card.Text>
                Envie d'un avant-goût ? Essayez nos mini-jeux en ligne (bientôt disponibles) :
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item><a href="#manoir">Énigmes du Manoir (à venir)</a></ListGroup.Item>
                <ListGroup.Item><a href="#nomades">Défis Nomades (à venir)</a></ListGroup.Item>
                <ListGroup.Item><a href="#tresors">Trésors Cachés (à venir)</a></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  );
};

export default HomePage;