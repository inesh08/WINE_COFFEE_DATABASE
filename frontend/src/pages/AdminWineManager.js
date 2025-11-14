import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wineAPI } from '../services/api';

const EMPTY_WINE = {
  name: '',
  type: '',
  region: '',
  country: '',
  vintage: '',
  price: '',
  alcohol_content: '',
  acidity_level: 'medium',
  sweetness_level: 'dry',
  stock: 0
};

const AdminWineManager = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_WINE);
  const [editingId, setEditingId] = useState(null);
  const [restock, setRestock] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/wines', { replace: true });
    }
  }, [isAdmin, navigate]);

  const fetchWines = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await wineAPI.getAll();
      setWines(response.wines || []);
    } catch (err) {
      setError(err.message || 'Unable to load wines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchWines();
    }
  }, [isAdmin]);

  const filteredWines = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return wines;
    return wines.filter(wine => [
      wine.name,
      wine.type,
      wine.region,
      wine.country,
      wine.vintage
    ].some(field => (field || '').toString().toLowerCase().includes(term)));
  }, [wines, search]);

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_WINE);
    setEditingId(null);
  };

  const startEdit = (wine) => {
    setEditingId(wine.id);
    setForm({
      name: wine.name || '',
      type: wine.type || '',
      region: wine.region || '',
      country: wine.country || '',
      vintage: wine.vintage || '',
      price: wine.price ?? '',
      alcohol_content: wine.alcohol_content ?? '',
      acidity_level: wine.acidity_level || 'medium',
      sweetness_level: wine.sweetness_level || 'dry',
      stock: wine.stock ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: form.price === '' ? null : Number(form.price),
      alcohol_content: form.alcohol_content === '' ? null : Number(form.alcohol_content),
      stock: Number(form.stock || 0)
    };

    try {
      if (editingId) {
        await wineAPI.update(editingId, payload);
        alert('Wine updated successfully.');
      } else {
        await wineAPI.create(payload);
        alert('Wine created successfully.');
      }
      resetForm();
      fetchWines();
    } catch (err) {
      alert(err.message || 'Failed to save wine.');
    }
  };

  const handleDelete = async (wineId) => {
    if (!window.confirm('Delete this wine from the catalogue?')) return;
    try {
      await wineAPI.delete(wineId);
      alert('Wine removed successfully.');
      fetchWines();
    } catch (err) {
      alert(err.message || 'Unable to delete wine.');
    }
  };

  const handleRestock = async (wine) => {
    const amount = Number(restock[wine.id] || 0);
    if (!amount || amount <= 0) {
      alert('Enter a quantity greater than zero.');
      return;
    }
    try {
      await wineAPI.update(wine.id, { stock: (wine.stock || 0) + amount });
      setRestock(prev => ({ ...prev, [wine.id]: '' }));
      fetchWines();
    } catch (err) {
      alert(err.message || 'Unable to update stock.');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <div className="luxury-card" style={{marginBottom: '2rem', padding: '2.5rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.6rem', marginBottom: '1rem'}}>🍷 Admin • Wine Studio</h1>
        <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>
          Curate, restock, and fine-tune every bottle available to guests. Use the form below to add new wines or update existing entries.
        </p>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}>
            <input className="luxury-input" placeholder="Name" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            <input className="luxury-input" placeholder="Type (e.g. Red)" value={form.type} onChange={(e) => handleInputChange('type', e.target.value)} required />
            <input className="luxury-input" placeholder="Region" value={form.region} onChange={(e) => handleInputChange('region', e.target.value)} />
            <input className="luxury-input" placeholder="Country" value={form.country} onChange={(e) => handleInputChange('country', e.target.value)} />
            <input className="luxury-input" placeholder="Vintage" value={form.vintage} onChange={(e) => handleInputChange('vintage', e.target.value)} />
            <input className="luxury-input" type="number" step="0.01" placeholder="Price (₹)" value={form.price} onChange={(e) => handleInputChange('price', e.target.value)} />
            <input className="luxury-input" type="number" step="0.1" placeholder="Alcohol %" value={form.alcohol_content} onChange={(e) => handleInputChange('alcohol_content', e.target.value)} />
            <input className="luxury-input" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => handleInputChange('stock', e.target.value)} />
          </div>
          <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}>
            <select className="luxury-input" value={form.acidity_level} onChange={(e) => handleInputChange('acidity_level', e.target.value)}>
              <option value="low">Acidity: Low</option>
              <option value="medium">Acidity: Medium</option>
              <option value="high">Acidity: High</option>
            </select>
            <select className="luxury-input" value={form.sweetness_level} onChange={(e) => handleInputChange('sweetness_level', e.target.value)}>
              <option value="dry">Sweetness: Dry</option>
              <option value="off-dry">Sweetness: Off-Dry</option>
              <option value="semi-sweet">Sweetness: Semi-Sweet</option>
              <option value="sweet">Sweetness: Sweet</option>
            </select>
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="luxury-button" style={{padding: '0.9rem 2.5rem'}}>
              {editingId ? 'Save Changes' : 'Add Wine'}
            </button>
            {editingId && (
              <button type="button" className="luxury-button-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="luxury-card" style={{marginBottom: '2rem', padding: '1.75rem'}}>
        <input
          className="luxury-input"
          placeholder="Search by name, region, type, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="luxury-card" style={{marginBottom: '2rem', padding: '1.5rem', border: '1px solid rgba(220,53,69,0.6)'}}>
          <p style={{color: '#ff6b6b', margin: 0}}>{error}</p>
        </div>
      )}

      <div style={{display: 'grid', gap: '1.5rem'}}>
        {loading ? (
          <div className="luxury-card" style={{padding: '2rem', textAlign: 'center', color: '#f0ead6'}}>
            Loading wines...
          </div>
        ) : filteredWines.length === 0 ? (
          <div className="luxury-card" style={{padding: '2rem', textAlign: 'center', color: '#f0ead6'}}>
            No wines found. Try adjusting your filters.
          </div>
        ) : (
          filteredWines.map(wine => (
            <div key={wine.id} className="luxury-card" style={{padding: '1.75rem', display: 'grid', gap: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
                <div>
                  <h3 className="gold-accent" style={{marginBottom: '0.3rem'}}>{wine.name}</h3>
                  <p style={{color: '#f0ead6', margin: 0}}>{wine.type} • {wine.region || 'Unknown region'} • {wine.country || 'Unknown origin'}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="gold-accent" style={{margin: 0, fontSize: '1.4rem'}}>₹{parseFloat(wine.price || 0).toLocaleString('en-IN')}</p>
                  <small style={{color: '#f0ead6'}}>Stock: {wine.stock ?? 0} bottle(s)</small>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                  <button className="luxury-button-secondary" onClick={() => startEdit(wine)}>Edit</button>
                  <button
                    className="luxury-button-secondary"
                    style={{borderColor: 'rgba(220,53,69,0.6)', color: '#ff6b6b'}}
                    onClick={() => handleDelete(wine.id)}
                  >
                    Delete
                  </button>
                </div>
                <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                  <input
                    type="number"
                    min="1"
                    className="luxury-input"
                    style={{width: '120px'}}
                    placeholder="Restock"
                    value={restock[wine.id] ?? ''}
                    onChange={(e) => setRestock(prev => ({ ...prev, [wine.id]: e.target.value }))}
                  />
                  <button className="luxury-button" style={{padding: '0.6rem 1.5rem'}} onClick={() => handleRestock(wine)}>
                    Restock
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminWineManager;
