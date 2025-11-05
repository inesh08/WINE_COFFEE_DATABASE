import React, { useState, useEffect } from 'react';
import '../styles/CoffeeSearchPage.css';

const CoffeeSearchPage = ({ onResults, onBack, products = [] }) => {
  const [filters, setFilters] = useState({
    type: '',
    roast: '',
    acidity: '',
    origin: '',
    region: '',
    search: ''
  });

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filtered = products;
    
    if (filters.type) filtered = filtered.filter(p => p.type === filters.type);
    if (filters.roast) filtered = filtered.filter(p => p.roast_level === filters.roast);
    if (filters.acidity) filtered = filtered.filter(p => p.acidity_level === filters.acidity);
    if (filters.origin) filtered = filtered.filter(p => p.country === filters.origin);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.origin?.toLowerCase().includes(search) ||
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
    <div className="coffee-search-page">
      <h1 className="page-title gold-accent">☕ COFFEE COLLECTION</h1>
      
      <div className="filter-container luxury-card">
        <div className="filter-grid">
          <div className="filter-group">
            <label className="gold-accent">Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="arabica">Arabica</option>
              <option value="robusta">Robusta</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Roast Level</label>
            <select value={filters.roast} onChange={(e) => handleFilterChange('roast', e.target.value)}>
              <option value="">All</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="medium-dark">Medium-Dark</option>
              <option value="dark">Dark</option>
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
            <label className="gold-accent">Origin</label>
            <select value={filters.origin} onChange={(e) => handleFilterChange('origin', e.target.value)}>
              <option value="">All Origins</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Colombia">Colombia</option>
              <option value="Brazil">Brazil</option>
              <option value="Kenya">Kenya</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="gold-accent">Region</label>
            <select value={filters.region} onChange={(e) => handleFilterChange('region', e.target.value)}>
              <option value="">All Regions</option>
              <option value="Yirgacheffe">Yirgacheffe</option>
              <option value="Sidamo">Sidamo</option>
              <option value="Huila">Huila</option>
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
        <h2 className="gold-accent">Results: {filteredProducts.length} coffees</h2>
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        ← BACK
      </button>
    </div>
  );
};

export default CoffeeSearchPage;

