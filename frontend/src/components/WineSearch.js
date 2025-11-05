import React, { useState, useEffect } from 'react';
import './Search.css';

const WineSearch = ({ onSearchResults, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWines();
  }, [category]);

  const fetchWines = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/queries/all-wines');
      const data = await response.json();
      setWines(data.data || []);
      onSearchResults(data.data || []);
    } catch (error) {
      console.error('Error fetching wines:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWines();
  };

  return (
    <div className="search-page">
      <h1 className="page-title gold-accent">Wine Collection</h1>
      
      <div className="search-container luxury-card">
        <div className="category-filters-grid">
          <div className="filter-section">
            <h3 className="gold-accent">Filter by Type:</h3>
            <select className="luxury-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Wines</option>
              <option value="red">Red</option>
              <option value="white">White</option>
              <option value="sparkling">Sparkling</option>
              <option value="rose">Rose</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Filter by Region:</h3>
            <select className="luxury-input">
              <option value="">All Regions</option>
              <option value="Napa Valley">Napa Valley</option>
              <option value="Bordeaux">Bordeaux</option>
              <option value="Burgundy">Burgundy</option>
              <option value="Tuscany">Tuscany</option>
              <option value="Rioja">Rioja</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Filter by Grape:</h3>
            <select className="luxury-input">
              <option value="">All Grapes</option>
              <option value="Cabernet">Cabernet</option>
              <option value="Merlot">Merlot</option>
              <option value="Pinot">Pinot</option>
              <option value="Chardonnay">Chardonnay</option>
              <option value="Sauvignon">Sauvignon Blanc</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Alcohol %:</h3>
            <select className="luxury-input">
              <option value="">All Levels</option>
              <option value="low">10% - 12%</option>
              <option value="medium">12% - 14%</option>
              <option value="high">14%+</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Acidity Level:</h3>
            <select className="luxury-input">
              <option value="">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Sweetness:</h3>
            <select className="luxury-input">
              <option value="">All Levels</option>
              <option value="dry">Dry</option>
              <option value="off-dry">Off-Dry</option>
              <option value="semi-sweet">Semi-Sweet</option>
              <option value="sweet">Sweet</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="luxury-input"
            placeholder="Search wines by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="luxury-button">SEARCH</button>
        </form>
      </div>

      {loading && <div className="loading-message">Loading...</div>}

      <button className="luxury-button-secondary" onClick={onBack}>
        BACK
      </button>
    </div>
  );
};

export default WineSearch;

