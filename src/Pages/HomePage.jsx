import { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import '../Styles/HomePage.css';

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Container className="mt-5 pt-5 homepage">
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

        <section className="discover-games mt-4">
          <Card>
            <Card.Body>
              <Card.Title as="h2">Découvrez Nos Escape Games</Card.Title>
              <Card.Text>
                Plongez dans des univers captivants et testez vos compétences avec nos escape games uniques. Sur site ou à domicile, il y en a pour tous les goûts !
              </Card.Text>
              <Button as={Link} to="/escape-games" variant="primary">
                Voir les Escape Games
              </Button>
            </Card.Body>
          </Card>
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
    </div>
  );
};

export default HomePage;