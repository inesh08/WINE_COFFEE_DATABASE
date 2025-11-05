import React, { useState, useEffect } from 'react';
import './Search.css';

const CoffeeSearch = ({ onSearchResults, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoffees();
  }, [category]);

  const fetchCoffees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/queries/all-coffees');
      const data = await response.json();
      setCoffees(data.data || []);
      onSearchResults(data.data || []);
    } catch (error) {
      console.error('Error fetching coffees:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoffees();
  };

  return (
    <div className="search-page">
      <h1 className="page-title gold-accent">Coffee Collection</h1>
      
      <div className="search-container luxury-card">
        <div className="category-filters-grid">
          <div className="filter-section">
            <h3 className="gold-accent">Filter by Type:</h3>
            <select className="luxury-input">
              <option value="">All Types</option>
              <option value="arabica">Arabica</option>
              <option value="robusta">Robusta</option>
              <option value="blend">Blend</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Roast Level:</h3>
            <select className="luxury-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Roasts</option>
              <option value="light">Light Roast</option>
              <option value="medium">Medium Roast</option>
              <option value="medium-dark">Medium-Dark Roast</option>
              <option value="dark">Dark Roast</option>
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
            <h3 className="gold-accent">Filter by Origin:</h3>
            <select className="luxury-input">
              <option value="">All Origins</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Colombia">Colombia</option>
              <option value="Brazil">Brazil</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Kenya">Kenya</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Filter by Region:</h3>
            <select className="luxury-input">
              <option value="">All Regions</option>
              <option value="Yirgacheffe">Yirgacheffe</option>
              <option value="Sidamo">Sidamo</option>
              <option value="Huila">Huila</option>
              <option value="Napa Valley">Napa Valley</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="gold-accent">Processing Method:</h3>
            <select className="luxury-input">
              <option value="">All Methods</option>
              <option value="washed">Washed</option>
              <option value="natural">Natural</option>
              <option value="honey">Honey</option>
              <option value="anaerobic">Anaerobic</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="luxury-input"
            placeholder="Search coffees by name..."
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

export default CoffeeSearch;

