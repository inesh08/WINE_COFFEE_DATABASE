import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import './App.css';
import { wineAPI, coffeeAPI, demoAPI, reviewAPI } from './services/api';

// Simple pages using inline styles
const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      textAlign: 'center', 
      padding: '4rem',
      color: '#d4af37',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Premium Wine & Coffee Collection</h1>
      <p style={{
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: '#f0ead6',
        marginBottom: '3rem',
        maxWidth: '800px',
        lineHeight: '1.8'
      }}>
        "Where every sip tells a story — from sunrise brews to moonlit pours."
      </p>
      <button onClick={() => navigate('/choose')} className="luxury-button">ENTER</button>
    </div>
  );
};

const ChooseProduct = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h2 className="gold-accent" style={{marginBottom: '2rem'}}>Choose Product Type</h2>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', marginBottom: '2rem'}}>
        <div onClick={() => navigate('/wines')} className="luxury-card" style={{cursor: 'pointer', padding: '3rem 2rem'}}>
          <h3 className="gold-accent" style={{fontSize: '2rem'}}>🍷 WINE</h3>
        </div>
        <div onClick={() => navigate('/coffees')} className="luxury-card" style={{cursor: 'pointer', padding: '3rem 2rem'}}>
          <h3 className="gold-accent" style={{fontSize: '2rem'}}>☕ COFFEE</h3>
        </div>
      </div>
      <Link to="/" className="luxury-button-secondary">← BACK</Link>
    </div>
  );
};

const WineSearch = () => {
  const [allWines, setAllWines] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '',
    name: '',
    region: '',
    alcoholLevel: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWine, setEditingWine] = useState(null);
  const [newWine, setNewWine] = useState({
    name: '', type: '', region: '', country: '', vintage: '', 
    price: '', alcohol_content: '', acidity_level: '', sweetness_level: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    demoAPI.query('all-wines')
      .then(d => {
        console.log('Fetched wines:', d.data?.length, 'wines');
        setAllWines(d.data || []);
      })
      .catch(err => console.error('Error fetching wines:', err));
  }, []);

  // Apply all filters together
  useEffect(() => {
    let filtered = [...allWines];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(wine => 
        wine.name?.toLowerCase().includes(term) ||
        wine.region?.toLowerCase().includes(term) ||
        wine.country?.toLowerCase().includes(term) ||
        wine.type?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(wine => wine.type === filters.type);
    }
    
    // Apply name filter
    if (filters.name) {
      filtered = filtered.filter(wine => wine.name?.includes(filters.name));
    }
    
    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter(wine => wine.region === filters.region);
    }
    
    // Apply alcohol level filter
    if (filters.alcoholLevel) {
      const level = filters.alcoholLevel;
      if (level === 'low') {
        filtered = filtered.filter(w => parseFloat(w.alcohol_content || 0) < 13);
      } else if (level === 'medium') {
        filtered = filtered.filter(w => {
          const alc = parseFloat(w.alcohol_content || 0);
          return alc >= 13 && alc < 14;
        });
      } else if (level === 'high') {
        filtered = filtered.filter(w => parseFloat(w.alcohol_content || 0) >= 14);
      }
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    setFilteredWines(filtered);
  }, [allWines, filters]);

  const handleAddWine = async () => {
    try {
      if (editingWine) {
        // Update existing wine
        await wineAPI.update(editingWine.id, newWine);
        alert('Wine updated successfully!');
        setEditingWine(null);
      } else {
        // Create new wine
        await wineAPI.create(newWine);
        alert('Wine added successfully!');
      }
      setShowAddModal(false);
      setNewWine({ name: '', type: '', region: '', country: '', vintage: '', 
                   price: '', alcohol_content: '', acidity_level: '', sweetness_level: '' });
      // Refresh wine list
      const data = await demoAPI.query('all-wines');
      setAllWines(data.data || []);
    } catch (err) {
      alert('Error: ' + (err.message || 'Failed to save wine'));
    }
  };

  const handleEditWine = (wine) => {
    setEditingWine(wine);
    setNewWine({
      name: wine.name || '',
      type: wine.type || '',
      region: wine.region || '',
      country: wine.country || '',
      vintage: wine.vintage || '',
      price: wine.price || '',
      alcohol_content: wine.alcohol_content || '',
      acidity_level: wine.acidity_level || '',
      sweetness_level: wine.sweetness_level || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteWine = async (wineId) => {
    if (window.confirm('Are you sure you want to delete this wine?')) {
      try {
        await wineAPI.delete(wineId);
        alert('Wine deleted successfully!');
        // Refresh wine list
        const data = await demoAPI.query('all-wines');
        setAllWines(data.data || []);
      } catch (err) {
        alert('Error: ' + (err.message || 'Failed to delete wine'));
      }
    }
  };

  const handleSearch = (e) => {
    setFilters({...filters, searchTerm: e.target.value});
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({...filters, [filterKey]: value});
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(allWines.map(w => w[key]).filter(Boolean))];
    return values.sort((a, b) => {
      const valA = String(a).toLowerCase();
      const valB = String(b).toLowerCase();
      return valA.localeCompare(valB);
    });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem', margin: 0}}>🍷 Wine Search</h1>
        <button onClick={() => setShowAddModal(true)} className="luxury-button" style={{padding: '1rem 2rem'}}>
          + Add New Wine
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={{marginBottom: '2rem'}}>
        <input
          type="text"
          placeholder="Search wines by name, region, type, country..."
          value={filters.searchTerm}
          onChange={handleSearch}
          className="luxury-input"
          style={{width: '100%', padding: '1.5rem', fontSize: '1.2rem'}}
        />
      </div>

      {/* Category Filters */}
      <div className="luxury-card" style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Filter by Category:</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Wine Type</label>
            <select 
              className="luxury-input" 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type').map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Brand/Name</label>
            <select 
              className="luxury-input" 
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            >
              <option value="">All Brands</option>
              {getUniqueValues('name').slice(0, 20).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Region</label>
            <select 
              className="luxury-input" 
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              {getUniqueValues('region').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Alcohol %</label>
            <select 
              className="luxury-input" 
              value={filters.alcoholLevel}
              onChange={(e) => handleFilterChange('alcoholLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="low">Low (&lt;13%)</option>
              <option value="medium">Medium (13-14%)</option>
              <option value="high">High (14%+)</option>
            </select>
          </div>
        </div>
        {(filters.type || filters.name || filters.region || filters.alcoholLevel) && (
          <button 
            onClick={() => setFilters({searchTerm: filters.searchTerm, type: '', name: '', region: '', alcoholLevel: ''})}
            className="luxury-button-secondary"
            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      <div style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Results: {filteredWines.length} wines</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {filteredWines.map(wine => {
            const currentYear = new Date().getFullYear();
            const age = wine.vintage ? currentYear - wine.vintage : null;
            return (
              <div key={wine.id} className="product-card" style={{position: 'relative'}}>
                <div onClick={() => navigate(`/product/${wine.id}?type=wine`)} style={{cursor: 'pointer'}}>
                  <h4 className="gold-accent" style={{fontSize: '1.2rem'}}>{wine.name}</h4>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Type: {wine.type || 'N/A'}</p>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Region: {wine.region || 'N/A'}</p>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {wine.country || 'N/A'}</p>
                  {wine.vintage && (
                    <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                      Vintage: {wine.vintage} {age ? `(${age} years old)` : ''}
                    </p>
                  )}
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                    Alcohol: {wine.alcohol_content ? `${wine.alcohol_content}%` : 'N/A'}
                  </p>
                  <p className="gold-accent" style={{fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem'}}>
                    ₹{parseFloat(wine.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleEditWine(wine);}}
                    className="luxury-button-secondary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1}}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleDeleteWine(wine.id);}}
                    className="luxury-button-secondary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, backgroundColor: 'rgba(220, 53, 69, 0.3)'}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <Link to="/choose" className="luxury-button-secondary" style={{display: 'block', textAlign: 'center', marginTop: '2rem'}}>← BACK</Link>

      {/* Add Wine Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="luxury-card" style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem'}}>Add New Wine</h2>
            
            <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Name *</label>
                <input className="luxury-input" value={newWine.name} 
                  onChange={(e) => setNewWine({...newWine, name: e.target.value})} 
                  placeholder="Wine name" required />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Type *</label>
                <input className="luxury-input" value={newWine.type} 
                  onChange={(e) => setNewWine({...newWine, type: e.target.value})} 
                  placeholder="e.g., Red, White, Rose" required />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Region</label>
                  <input className="luxury-input" value={newWine.region} 
                    onChange={(e) => setNewWine({...newWine, region: e.target.value})} 
                    placeholder="Region" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Country</label>
                  <input className="luxury-input" value={newWine.country} 
                    onChange={(e) => setNewWine({...newWine, country: e.target.value})} 
                    placeholder="Country" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Vintage</label>
                  <input className="luxury-input" type="number" value={newWine.vintage} 
                    onChange={(e) => setNewWine({...newWine, vintage: e.target.value})} 
                    placeholder="Year" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Price (₹)</label>
                  <input className="luxury-input" type="number" step="0.01" value={newWine.price} 
                    onChange={(e) => setNewWine({...newWine, price: e.target.value})} 
                    placeholder="Price" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Alcohol %</label>
                  <input className="luxury-input" type="number" step="0.1" value={newWine.alcohol_content} 
                    onChange={(e) => setNewWine({...newWine, alcohol_content: e.target.value})} 
                    placeholder="%" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity Level</label>
                  <select className="luxury-input" value={newWine.acidity_level} 
                    onChange={(e) => setNewWine({...newWine, acidity_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Sweetness Level</label>
                  <select className="luxury-input" value={newWine.sweetness_level} 
                    onChange={(e) => setNewWine({...newWine, sweetness_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="dry">Dry</option>
                    <option value="off-dry">Off-Dry</option>
                    <option value="semi-sweet">Semi-Sweet</option>
                    <option value="sweet">Sweet</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowAddModal(false)} className="luxury-button-secondary">
                Cancel
              </button>
              <button onClick={handleAddWine} className="luxury-button">
                Add Wine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CoffeeSearch = () => {
  const [allCoffees, setAllCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '',
    roastLevel: '',
    origin: '',
    acidityLevel: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState(null);
  const [newCoffee, setNewCoffee] = useState({
    name: '', type: '', origin: '', country: '', roast_level: '', 
    price: '', description: '', acidity_level: ''
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    demoAPI.query('all-coffees')
      .then(d => {
        console.log('Fetched coffees:', d.data?.length, 'coffees');
        setAllCoffees(d.data || []);
      })
      .catch(err => console.error('Error fetching coffees:', err));
  }, []);

  // Apply all filters together
  useEffect(() => {
    let filtered = [...allCoffees];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coffee => 
        coffee.name?.toLowerCase().includes(term) ||
        coffee.origin?.toLowerCase().includes(term) ||
        coffee.country?.toLowerCase().includes(term) ||
        coffee.type?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(coffee => coffee.type === filters.type);
    }
    
    // Apply roast level filter
    if (filters.roastLevel) {
      filtered = filtered.filter(coffee => coffee.roast_level === filters.roastLevel);
    }
    
    // Apply origin filter
    if (filters.origin) {
      filtered = filtered.filter(coffee => coffee.origin === filters.origin);
    }
    
    // Apply acidity level filter
    if (filters.acidityLevel) {
      filtered = filtered.filter(coffee => coffee.acidity_level === filters.acidityLevel);
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    setFilteredCoffees(filtered);
  }, [allCoffees, filters]);

  const handleAddCoffee = async () => {
    try {
      if (editingCoffee) {
        // Update existing coffee
        await coffeeAPI.update(editingCoffee.id, newCoffee);
        alert('Coffee updated successfully!');
        setEditingCoffee(null);
      } else {
        // Create new coffee
        await coffeeAPI.create(newCoffee);
        alert('Coffee added successfully!');
      }
      setShowAddModal(false);
      setNewCoffee({ name: '', type: '', origin: '', country: '', roast_level: '', 
                     price: '', description: '', acidity_level: '' });
      // Refresh coffee list
      const data = await demoAPI.query('all-coffees');
      setAllCoffees(data.data || []);
    } catch (err) {
      alert('Error: ' + (err.message || 'Failed to save coffee'));
    }
  };

  const handleEditCoffee = (coffee) => {
    setEditingCoffee(coffee);
    setNewCoffee({
      name: coffee.name || '',
      type: coffee.type || '',
      origin: coffee.origin || '',
      country: coffee.country || '',
      roast_level: coffee.roast_level || '',
      price: coffee.price || '',
      description: coffee.description || '',
      acidity_level: coffee.acidity_level || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteCoffee = async (coffeeId) => {
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      try {
        await coffeeAPI.delete(coffeeId);
        alert('Coffee deleted successfully!');
        // Refresh coffee list
        const data = await demoAPI.query('all-coffees');
        setAllCoffees(data.data || []);
      } catch (err) {
        alert('Error: ' + (err.message || 'Failed to delete coffee'));
      }
    }
  };

  const handleSearch = (e) => {
    setFilters({...filters, searchTerm: e.target.value});
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({...filters, [filterKey]: value});
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(allCoffees.map(c => c[key]).filter(Boolean))];
    return values.sort((a, b) => {
      const valA = String(a).toLowerCase();
      const valB = String(b).toLowerCase();
      return valA.localeCompare(valB);
    });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem', margin: 0}}>☕ Coffee Search</h1>
        <button onClick={() => setShowAddModal(true)} className="luxury-button" style={{padding: '1rem 2rem'}}>
          + Add New Coffee
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={{marginBottom: '2rem'}}>
        <input
          type="text"
          placeholder="Search coffees by name, origin, type, country..."
          value={filters.searchTerm}
          onChange={handleSearch}
          className="luxury-input"
          style={{width: '100%', padding: '1.5rem', fontSize: '1.2rem'}}
        />
      </div>

      {/* Category Filters */}
      <div className="luxury-card" style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Filter by Category:</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Coffee Type</label>
            <select 
              className="luxury-input" 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Roast Level</label>
            <select 
              className="luxury-input" 
              value={filters.roastLevel}
              onChange={(e) => handleFilterChange('roastLevel', e.target.value)}
            >
              <option value="">All Roasts</option>
              {getUniqueValues('roast_level').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Origin/Region</label>
            <select 
              className="luxury-input" 
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
            >
              <option value="">All Origins</option>
              {getUniqueValues('origin').map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity</label>
            <select 
              className="luxury-input" 
              value={filters.acidityLevel}
              onChange={(e) => handleFilterChange('acidityLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              {getUniqueValues('acidity_level').map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        {(filters.type || filters.roastLevel || filters.origin || filters.acidityLevel) && (
          <button 
            onClick={() => setFilters({searchTerm: filters.searchTerm, type: '', roastLevel: '', origin: '', acidityLevel: ''})}
            className="luxury-button-secondary"
            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      <div style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Results: {filteredCoffees.length} coffees</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {filteredCoffees.map(coffee => (
            <div key={coffee.id} className="product-card" style={{position: 'relative'}}>
              <div onClick={() => navigate(`/product/${coffee.id}?type=coffee`)} style={{cursor: 'pointer'}}>
                <h4 className="gold-accent" style={{fontSize: '1.2rem'}}>{coffee.name}</h4>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Type: {coffee.type || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Origin: {coffee.origin || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {coffee.country || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Roast Level: {coffee.roast_level ? coffee.roast_level.charAt(0).toUpperCase() + coffee.roast_level.slice(1).replace('-', ' ') : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Acidity: {coffee.acidity_level ? coffee.acidity_level.charAt(0).toUpperCase() + coffee.acidity_level.slice(1) : 'N/A'}
                </p>
                {coffee.description && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic'}}>
                    {coffee.description.length > 60 ? coffee.description.substring(0, 60) + '...' : coffee.description}
                  </p>
                )}
                <p className="gold-accent" style={{fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem'}}>
                  ₹{parseFloat(coffee.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <button 
                  onClick={(e) => {e.stopPropagation(); handleEditCoffee(coffee);}}
                  className="luxury-button-secondary"
                  style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1}}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={(e) => {e.stopPropagation(); handleDeleteCoffee(coffee.id);}}
                  className="luxury-button-secondary"
                  style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, backgroundColor: 'rgba(220, 53, 69, 0.3)'}}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Link to="/choose" className="luxury-button-secondary" style={{display: 'block', textAlign: 'center', marginTop: '2rem'}}>← BACK</Link>

      {/* Add Coffee Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="luxury-card" style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem'}}>
              {editingCoffee ? 'Edit Coffee' : 'Add New Coffee'}
            </h2>
            
            <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Name *</label>
                <input className="luxury-input" value={newCoffee.name} 
                  onChange={(e) => setNewCoffee({...newCoffee, name: e.target.value})} 
                  placeholder="Coffee name" required />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Type *</label>
                <input className="luxury-input" value={newCoffee.type} 
                  onChange={(e) => setNewCoffee({...newCoffee, type: e.target.value})} 
                  placeholder="e.g., Arabica, Robusta, Blend" required />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Origin</label>
                  <input className="luxury-input" value={newCoffee.origin} 
                    onChange={(e) => setNewCoffee({...newCoffee, origin: e.target.value})} 
                    placeholder="Origin" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Country</label>
                  <input className="luxury-input" value={newCoffee.country} 
                    onChange={(e) => setNewCoffee({...newCoffee, country: e.target.value})} 
                    placeholder="Country" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Roast Level</label>
                  <select className="luxury-input" value={newCoffee.roast_level} 
                    onChange={(e) => setNewCoffee({...newCoffee, roast_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="medium-dark">Medium-Dark</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Price (₹)</label>
                  <input className="luxury-input" type="number" step="0.01" value={newCoffee.price} 
                    onChange={(e) => setNewCoffee({...newCoffee, price: e.target.value})} 
                    placeholder="Price" />
                </div>
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Description</label>
                <textarea className="luxury-input" value={newCoffee.description} 
                  onChange={(e) => setNewCoffee({...newCoffee, description: e.target.value})} 
                  placeholder="Description" rows="3" />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity Level</label>
                <select className="luxury-input" value={newCoffee.acidity_level} 
                  onChange={(e) => setNewCoffee({...newCoffee, acidity_level: e.target.value})}>
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowAddModal(false)} className="luxury-button-secondary">
                Cancel
              </button>
              <button onClick={handleAddCoffee} className="luxury-button">
                Add Coffee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  
  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    const queryType = type === 'wine' ? 'all-wines' : 'all-coffees';
    demoAPI.query(queryType)
      .then(d => {
        const foundProduct = d.data.find(p => p.id == id);
        setProduct(foundProduct);
        
        // Calculate stock based on rarity
        if (foundProduct) {
          const price = parseFloat(foundProduct.price || 0);
          // Rarer items (higher price) have lower stock
          // Price > 20000: 1-5 bottles (very rare)
          // Price > 10000: 5-15 bottles (rare)
          // Price > 5000: 10-30 bottles (premium)
          // Price <= 5000: 30-100 bottles (regular)
          let stockCount;
          if (price > 20000) {
            stockCount = Math.floor(Math.random() * 5) + 1; // 1-5
          } else if (price > 10000) {
            stockCount = Math.floor(Math.random() * 11) + 5; // 5-15
          } else if (price > 5000) {
            stockCount = Math.floor(Math.random() * 21) + 10; // 10-30
          } else {
            stockCount = Math.floor(Math.random() * 71) + 30; // 30-100
          }
          setStock(stockCount);
        }
      });
  }, [type]);

  if (!product) return <div style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>;

  // Build a brief, friendly history/context snippet (2–3 lines)
  const buildHistorySnippet = () => {
    const country = product.country || 'its country of origin';
    if (type === 'wine') {
      const region = product.region || 'renowned regions';
      const vintage = product.vintage ? ` Since ${product.vintage},` : ' Historically,';
      const grapeNote = product.type ? `${product.type.charAt(0).toUpperCase() + product.type.slice(1)} styles` : 'classic styles';
      return (
        `${vintage} ${grapeNote} from ${region} have reflected the terroir of ${country}. ` +
        `This bottle follows that tradition with careful cellar craft and a focus on balance.`
      );
    }
    // coffee
    const origin = product.origin || 'heritage origins';
    const roast = product.roast_level ? `${product.roast_level.replace('-', ' ')}` : 'artisan';
    return (
      `From ${origin}, ${country}, this ${roast} roast traces its roots to smallholder farms ` +
      `where careful processing shaped the region’s signature cup profile.`
    );
  };

  const historySnippet = buildHistorySnippet();

  const addToCart = () => {
    if (quantity > stock) {
      alert(`Only ${stock} ${type === 'wine' ? 'bottles' : 'packages'} available!`);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id && item.category === type);
    
    if (existingIndex >= 0) {
      // Update quantity if already in cart
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      // Add new item with quantity and category
      cart.push({...product, quantity, category: type});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${quantity} ${quantity === 1 ? (type === 'wine' ? 'bottle' : 'package') : (type === 'wine' ? 'bottles' : 'packages')} to cart!`);
    
    // Update stock display
    setStock(stock - quantity);
    setQuantity(1);
  };

  const currentYear = new Date().getFullYear();
  const age = product.vintage ? currentYear - product.vintage : null;

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{product.name}</h1>
      
      {/* Short history/context snippet */}
      <div className="luxury-card" style={{padding: '1rem 1.25rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.35)'}}>
        <p style={{color: '#f0ead6', margin: 0, lineHeight: 1.6}}>{historySnippet}</p>
      </div>

      {/* Stock Information Banner */}
      <div className="luxury-card" style={{
        padding: '1.5rem', 
        marginBottom: '1.5rem', 
        backgroundColor: stock < 10 ? 'rgba(220, 53, 69, 0.2)' : stock < 30 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0,0,0,0.3)',
        border: stock < 10 ? '2px solid #dc3545' : stock < 30 ? '2px solid #ffa500' : '2px solid #d4af37'
      }}>
        <p style={{
          color: stock < 10 ? '#ff6b6b' : stock < 30 ? '#ffa500' : '#d4af37', 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: 'center'
        }}>
          {stock > 0 ? (
            <>📦 {stock} {type === 'wine' ? 'bottles' : 'packages'} left in stock</>
          ) : (
            <>⚠️ Out of Stock</>
          )}
        </p>
        {stock < 10 && stock > 0 && (
          <p style={{color: '#f0ead6', fontSize: '1rem', marginTop: '0.5rem', margin: 0, textAlign: 'center'}}>
            ⚡ Limited availability - Order soon!
          </p>
        )}
      </div>

      <div className="luxury-card" style={{padding: '2rem'}}>
        <div style={{marginBottom: '1.5rem'}}>
          {type === 'wine' ? (
            <>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Type:</strong> {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Region:</strong> {product.region || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Country:</strong> {product.country || 'N/A'}
                </p>
                {product.vintage && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Vintage:</strong> {product.vintage} {age ? `(${age} years old)` : ''}
                  </p>
                )}
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Alcohol Content:</strong> {product.alcohol_content ? `${product.alcohol_content}%` : 'N/A'}
                </p>
                {product.acidity_level && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Acidity:</strong> {product.acidity_level.charAt(0).toUpperCase() + product.acidity_level.slice(1)}
                  </p>
                )}
                {product.sweetness_level && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Sweetness:</strong> {product.sweetness_level.charAt(0).toUpperCase() + product.sweetness_level.slice(1).replace('-', ' ')}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Type:</strong> {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Origin:</strong> {product.origin || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Country:</strong> {product.country || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Roast Level:</strong> {product.roast_level ? product.roast_level.charAt(0).toUpperCase() + product.roast_level.slice(1).replace('-', ' ') : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Acidity Level:</strong> {product.acidity_level ? product.acidity_level.charAt(0).toUpperCase() + product.acidity_level.slice(1) : 'N/A'}
                </p>
              </div>
              {product.description && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem', lineHeight: '1.6', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px'}}>
                  <strong className="gold-accent">Description:</strong> {product.description}
                </p>
              )}
            </>
          )}
        </div>
        
        <div style={{borderTop: '2px solid #d4af37', paddingTop: '1.5rem', marginTop: '1.5rem'}}>
          <p className="gold-accent" style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center'}}>
            ₹{parseFloat(product.price || 0).toLocaleString('en-IN')}
          </p>
          
          {stock > 0 && (
          <div style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <label className="gold-accent" style={{fontSize: '1.1rem'}}>Quantity:</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <button 
                className="luxury-button-secondary" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{padding: '0.5rem 1rem', fontSize: '1.2rem'}}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(stock, val)));
                }}
                className="luxury-input"
                style={{width: '80px', textAlign: 'center', fontSize: '1.2rem', padding: '0.5rem'}}
              />
              <button 
                className="luxury-button-secondary" 
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                style={{padding: '0.5rem 1rem', fontSize: '1.2rem'}}
              >
                +
              </button>
            </div>
            <span style={{color: '#f0ead6', fontSize: '1rem'}}>
              Total: ₹{(parseFloat(product.price || 0) * quantity).toLocaleString('en-IN')}
            </span>
          </div>
          )}
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          {stock > 0 ? (
            <>
              <button 
                className="luxury-button" 
                onClick={addToCart} 
                style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px'}}
              >
                🛒 ADD TO CART
              </button>
              <button 
                className="luxury-button" 
                onClick={() => navigate('/checkout')} 
                style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px'}}
              >
                🛍️ VIEW CART
              </button>
            </>
          ) : (
            <button 
              className="luxury-button-secondary" 
              disabled 
              style={{fontSize: '1.2rem', padding: '1rem 2rem', opacity: 0.5, cursor: 'not-allowed', minWidth: '200px'}}
            >
              OUT OF STOCK
            </button>
          )}
          <Link 
            to={type === 'wine' ? '/wines' : '/coffees'} 
            className="luxury-button-secondary" 
            style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px', textAlign: 'center', display: 'inline-block'}}
          >
            ← BACK
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (parseFloat(item.price || 0) * quantity);
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Determine what types of products are in the cart
    const hasWine = cart.some(item => {
      const itemType = item.category || (item.region ? 'wine' : 'coffee');
      return itemType === 'wine';
    });
    const hasCoffee = cart.some(item => {
      const itemType = item.category || (item.region ? 'wine' : 'coffee');
      return itemType === 'coffee';
    });
    
    // Calculate counts for better messaging
    const wineCount = cart.filter(item => {
      const itemType = item.category || (item.region ? 'wine' : 'coffee');
      return itemType === 'wine';
    }).length;
    const coffeeCount = cart.filter(item => {
      const itemType = item.category || (item.region ? 'wine' : 'coffee');
      return itemType === 'coffee';
    }).length;
    
    // Store last order items for rating flow, then clear the cart
    const lastOrderItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category || (item.region ? 'wine' : 'coffee'),
      quantity: item.quantity || 1
    }));
    localStorage.setItem('lastOrderItems', JSON.stringify(lastOrderItems));
    localStorage.removeItem('cart');
    setCart([]);
    
    // Show success message with recommendations
    let message = `✅ Order Complete!\n\nThank you for your purchase of ${itemCount} ${itemCount === 1 ? 'item' : 'items'} worth ₹${total.toLocaleString('en-IN')}!\n\n`;
    
    // Thank-you then go to rating page
    message += '⭐ Please rate the items you purchased to help others!';
    alert(message);
    navigate('/rate');
  };

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🛒 Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="luxury-card" style={{padding: '3rem', textAlign: 'center'}}>
          <p style={{color: '#f0ead6', fontSize: '1.5rem', marginBottom: '2rem'}}>Your cart is empty</p>
          <button className="luxury-button" onClick={() => navigate('/choose')}>Continue Shopping</button>
          </div>
      ) : (
        <>
          <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem', fontSize: '1.8rem'}}>Your Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
            {cart.map((item, i) => {
              const quantity = item.quantity || 1;
              const itemTotal = parseFloat(item.price || 0) * quantity;
              // Get item category (wine or coffee)
              const itemType = item.category || (item.region ? 'wine' : 'coffee');
              const productType = item.type; // This is the product type (red/white/arabica/robusta)
              
              return (
                <div key={i} style={{
                  borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '1.5rem 0',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <div style={{flex: 1}}>
                    <h3 className="gold-accent" style={{fontSize: '1.3rem', marginBottom: '0.5rem'}}>
                      {item.name}
                    </h3>
                    <div style={{color: '#f0ead6', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      {itemType === 'wine' ? (
                        <>
                          {item.type && <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>}
                          {item.region && <span> • {item.region}</span>}
                          {item.vintage && <span> • {item.vintage}</span>}
                        </>
                      ) : (
                        <>
                          {item.type && <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>}
                          {item.origin && <span> • {item.origin}</span>}
                          {item.roast_level && <span> • {item.roast_level.charAt(0).toUpperCase() + item.roast_level.slice(1).replace('-', ' ')}</span>}
                        </>
                      )}
      </div>
                    <p style={{color: '#d4af37', fontSize: '1.1rem', fontWeight: 'bold'}}>
                      ₹{parseFloat(item.price || 0).toLocaleString('en-IN')} per {itemType === 'wine' ? 'bottle' : 'package'}
                    </p>
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '120px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <button 
                        className="luxury-button-secondary" 
                        onClick={() => updateQuantity(i, quantity - 1)}
                        style={{padding: '0.3rem 0.8rem', fontSize: '1rem'}}
                      >
                        -
                      </button>
                      <span style={{color: '#f0ead6', fontSize: '1.1rem', minWidth: '40px', textAlign: 'center'}}>
                        {quantity}
                      </span>
                      <button 
                        className="luxury-button-secondary" 
                        onClick={() => updateQuantity(i, quantity + 1)}
                        style={{padding: '0.3rem 0.8rem', fontSize: '1rem'}}
                      >
                        +
                      </button>
                    </div>
                    <p className="gold-accent" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </p>
                    <button 
                      className="luxury-button-secondary" 
                      onClick={() => removeFromCart(i)}
                      style={{padding: '0.3rem 0.8rem', fontSize: '0.9rem', marginTop: '0.5rem'}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="luxury-card" style={{padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem'}}>
              <span style={{color: '#f0ead6'}}>Items ({itemCount}):</span>
              <span className="gold-accent">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{borderTop: '2px solid #d4af37', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 className="gold-accent" style={{fontSize: '2rem', margin: 0}}>Total:</h2>
              <h2 className="gold-accent" style={{fontSize: '2rem', margin: 0}}>₹{total.toLocaleString('en-IN')}</h2>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
              <button className="luxury-button" onClick={handleCheckout} style={{fontSize: '1.2rem', padding: '1rem 2rem', flex: 1}}>
                ✅ COMPLETE ORDER
              </button>
              <button className="luxury-button-secondary" onClick={() => navigate('/choose')} style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose" element={<ChooseProduct />} />
        <Route path="/wines" element={<WineSearch />} />
        <Route path="/coffees" element={<CoffeeSearch />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/demo" element={<DBMSDemo />} />
      </Routes>
    </Router>
  );
}

const DBMSDemo = () => {
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  const testTriggers = async (type) => {
    try {
      const data = await demoAPI.testTrigger(type);
      setResults(prev => ({...prev, [`trigger_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`trigger_${type}`]: {error: err.message}}));
    }
  };

  const testProcedure = async (type) => {
    try {
      const data = await demoAPI.procedure(type);
      setResults(prev => ({...prev, [`procedure_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`procedure_${type}`]: {error: err.message}}));
    }
  };

  const runQuery = async (type) => {
    try {
      const data = await demoAPI.query(type);
      setResults(prev => ({...prev, [`query_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`query_${type}`]: {error: err.message}}));
    }
  };

  return (
    <div style={{padding: '2rem', maxWidth: '1400px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem'}}>🎯 DBMS Features Demo</h1>
        <Link to="/" className="luxury-button-secondary">← HOME</Link>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem'}}>
        {/* TRIGGERS */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>🔥 Triggers</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Automatic database operations that execute before/after data changes</p>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <button onClick={() => testTriggers('order-total')} className="luxury-button">
              1. Test Order Total Trigger
            </button>
            <small style={{color: '#d4af37'}}>Automatically calculates order totals</small>
            
            <button onClick={() => testTriggers('rating-validation')} className="luxury-button">
              2. Test Rating Validation Trigger
            </button>
            <small style={{color: '#d4af37'}}>Validates ratings between 1-5</small>
          </div>
          
          {results['trigger_order-total'] && (
            <div style={{backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '1rem'}}>
              <pre style={{color: '#f0ead6', fontSize: '0.9rem', overflow: 'auto'}}>
                {JSON.stringify(results['trigger_order-total'], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* STORED PROCEDURES */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>⚙️ Stored Procedures</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Pre-defined database operations for efficient data access</p>
          
          <div style={{display: 'grid', gap: '0.5rem'}}>
            <button onClick={() => testProcedure('wines')} className="luxury-button">Get Red Wines</button>
            <button onClick={() => testProcedure('coffees')} className="luxury-button">Get Light Roast Coffees</button>
            <button onClick={() => testProcedure('top-wines')} className="luxury-button">Get Top Rated Wines</button>
            <button onClick={() => testProcedure('top-coffees')} className="luxury-button">Get Top Rated Coffees</button>
          </div>
        </div>

        {/* QUERIES */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>📊 SQL Queries</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Execute SELECT queries on database tables</p>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>Basic Queries:</h3>
            <button onClick={() => runQuery('all-wines')} className="luxury-button">Query All Wines</button>
            <button onClick={() => runQuery('all-coffees')} className="luxury-button">Query All Coffees</button>
            <button onClick={() => runQuery('orders')} className="luxury-button">Query Orders</button>
            <button onClick={() => runQuery('customers')} className="luxury-button">Query Customers</button>
            <button onClick={() => runQuery('reviews')} className="luxury-button">Query Reviews</button>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>🔍 Nested Queries:</h3>
            <button onClick={() => runQuery('nested-wines-high-rated')} className="luxury-button">
              High-Rated Wines (Nested)
            </button>
            <small style={{color: '#d4af37'}}>Wines with reviews rating &gt; 4</small>
            <button onClick={() => runQuery('nested-coffees-high-rated')} className="luxury-button">
              High-Rated Coffees (Nested)
            </button>
            <small style={{color: '#d4af37'}}>Coffees with reviews rating &gt; 4</small>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>🔗 Join Queries:</h3>
            <button onClick={() => runQuery('join-wines-reviews')} className="luxury-button">
              Wines with Reviews (Join)
            </button>
            <small style={{color: '#d4af37'}}>Wines JOIN reviews with stats</small>
            <button onClick={() => runQuery('join-coffees-reviews')} className="luxury-button">
              Coffees with Reviews (Join)
            </button>
            <small style={{color: '#d4af37'}}>Coffees JOIN reviews with stats</small>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>📈 Aggregate Queries:</h3>
            <button onClick={() => runQuery('aggregate-wine-stats')} className="luxury-button">
              Wine Statistics (Aggregate)
            </button>
            <small style={{color: '#d4af37'}}>COUNT, AVG, MIN, MAX by type</small>
            <button onClick={() => runQuery('aggregate-coffee-stats')} className="luxury-button">
              Coffee Statistics (Aggregate)
            </button>
            <small style={{color: '#d4af37'}}>COUNT, AVG, MIN, MAX by type</small>
          </div>
        </div>

        {/* OPERATIONS */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>✨ Database Operations</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Add customers using stored procedures</p>
          
          <AddCustomerForm />
          <p style={{color: '#d4af37', fontSize: '0.9rem', marginTop: '1rem'}}>
            Also Available: Add Wine/Coffee from search pages
          </p>
        </div>
      </div>

      {/* Display Results */}
      {Object.keys(results).length > 0 && (
        <div className="luxury-card" style={{marginTop: '2rem'}}>
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>📋 Results</h2>
          {Object.entries(results).map(([key, value]) => (
            <div key={key} style={{marginBottom: '1rem'}}>
              <h3 style={{color: '#d4af37', fontSize: '1rem'}}>{key}:</h3>
              <pre style={{backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', color: '#f0ead6', fontSize: '0.85rem', overflow: 'auto', maxHeight: '300px'}}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({name: '', email: '', phone: '', address: ''});
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await demoAPI.addCustomer(formData);
      setResult(data);
      if (data.customer_id) {
        setFormData({name: '', email: '', phone: '', address: ''});
      }
    } catch (err) {
      setResult({error: err.message});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{display: 'grid', gap: '0.5rem'}}>
        <input className="luxury-input" value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Name" required />
        <input className="luxury-input" type="email" value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email" required />
        <input className="luxury-input" value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Phone" />
        <input className="luxury-input" value={formData.address} 
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Address" />
        <button type="submit" className="luxury-button">Add Customer</button>
      </div>
      {result && (
        <div style={{marginTop: '1rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px'}}>
          <pre style={{color: '#f0ead6', fontSize: '0.8rem'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
};

export default App;
