import React from 'react';
import '../styles/Home.css';

const Home = ({ onNext }) => {
  return (
    <div className="home-page">
      <div className="decorative-bird-top">🦅</div>
      <h1 className="home-title">Premium Wine & Coffee Collection</h1>
      <h2 className="home-subtitle">Discover Excellence</h2>
      <p className="home-description">
        Explore our curated selection of the world's finest wines and artisanal coffees.
      </p>
      <button className="luxury-button" onClick={onNext}>
        ENTER COLLECTION
      </button>
      <div className="decorative-bird-bottom">🦅</div>
    </div>
  );
};

export default Home;

