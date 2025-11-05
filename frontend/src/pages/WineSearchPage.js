import React, { useState, useEffect } from 'react';
import '../styles/WineSearchPage.css';

const WineSearchPage = ({ onResults, onBack, products = [] }) => {
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    grape: '',
    alcohol: '',
    acidity: '',
    sweetness: '',
    search: ''
  });

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filtered = products;
    
    if (filters.type) filtered = filtered.filter(p => p.type === filters.type);
    if (filters.region) filtered = filtered.filter(p => p.region?.includes(filters.region));
    if (filters.acidity) filtered = filtered.filter(p => p.acidity_level === filters.acidity);
    if (filters.sweetness) filtered = filtered.filter(p => p.sweetness_level === filters.sweetness);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.region?.toLowerCase().includes(search) ||
        p.country?.toLowerCase().includes(search)
      );
    }
    
    setFilteredProducts(filtered);
    onResults(filtered);
  }, [filters, products]);

  const handleFilterChange = (key, value) => {
    setFilters({...filters, [key]: value});
  };

  return (
    <div className="wine-search-page">
      <h1 className="page-title gold-accent">🍷 WINE COLLECTION</h1>
      
      <div className="filter-container luxury-card">
        <div className="filter-grid">
          <div className="filter-group">
            <label className="gold-accent">Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="red">Red</option>
              <option value="white">White</option>
              <option value="sparkling">Sparkling</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Region</label>
            <select value={filters.region} onChange={(e) => handleFilterChange('region', e.target.value)}>
              <option value="">All Regions</option>
              <option value="Napa Valley">Napa Valley</option>
              <option value="Bordeaux">Bordeaux</option>
              <option value="Tuscany">Tuscany</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Alcohol %</label>
            <select value={filters.alcohol} onChange={(e) => handleFilterChange('alcohol', e.target.value)}>
              <option value="">All</option>
              <option value="low">10-12%</option>
              <option value="medium">12-14%</option>
              <option value="high">14%+</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Acidity</label>
            <select value={filters.acidity} onChange={(e) => handleFilterChange('acidity', e.target.value)}>
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Sweetness</label>
            <select value={filters.sweetness} onChange={(e) => handleFilterChange('sweetness', e.target.value)}>
              <option value="">All</option>
              <option value="dry">Dry</option>
              <option value="off-dry">Off-Dry</option>
              <option value="sweet">Sweet</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Search</label>
            <input 
              type="text" 
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="results-section">
        <h2 className="gold-accent">Results: {filteredProducts.length} wines</h2>
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        ← BACK
      </button>
    </div>
  );
};

export default WineSearchPage;

