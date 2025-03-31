import { useState, useEffect } from 'react';
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

  if (loading) return <div className="homepage">Chargement...</div>;
  if (error) return <div className="homepage">Erreur : {error}</div>;

  return (
    <div className="homepage">
      <section className="presentation">
        <h1>Bienvenue chez Escape Adventure</h1>
        <h2>Qui sommes-nous ?</h2>
        <p>
          Escape Adventure est une entreprise passionnée par les expériences immersives. Nous proposons des escape games uniques, sur site ou à domicile, pour tous les amateurs de défis et d’énigmes. Que vous soyez en famille, entre amis ou en équipe, venez vivre une aventure inoubliable !
        </p>
      </section>

      <section className="escape-games">
        <h2>Nos Escape Games</h2>
        <div className="games-list">
          {escapeGames.length > 0 ? (
            escapeGames.map(game => <GameCard key={game.id} game={game} />)
          ) : (
            <p>Aucun escape game disponible pour le moment.</p>
          )}
        </div>
      </section>

      <section className="mini-games">
        <h2>Mini-Jeux Thématiques</h2>
        <p>Envie d’un avant-goût ? Essayez nos mini-jeux en ligne (bientôt disponibles) :</p>
        <ul>
          <li><a href="#">Énigmes du Manoir (à venir)</a></li>
          <li><a href="#">Défis Nomades (à venir)</a></li>
          <li><a href="#">Trésors Cachés (à venir)</a></li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;