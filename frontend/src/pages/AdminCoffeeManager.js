import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coffeeAPI } from '../services/api';

const EMPTY_COFFEE = {
  name: '',
  type: '',
  origin: '',
  country: '',
  roast_level: 'medium',
  price: '',
  description: '',
  acidity_level: 'medium',
  stock: 0
};

const AdminCoffeeManager = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_COFFEE);
  const [editingId, setEditingId] = useState(null);
  const [restock, setRestock] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/coffees', { replace: true });
    }
  }, [isAdmin, navigate]);

  const fetchCoffees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await coffeeAPI.getAll();
      setCoffees(response.coffees || response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load coffees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCoffees();
    }
  }, [isAdmin]);

  const filteredCoffees = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return coffees;
    return coffees.filter(coffee => [
      coffee.name,
      coffee.type,
      coffee.origin,
      coffee.country,
      coffee.roast_level
    ].some(field => (field || '').toString().toLowerCase().includes(term)));
  }, [coffees, search]);

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_COFFEE);
    setEditingId(null);
  };

  const startEdit = (coffee) => {
    setEditingId(coffee.id);
    setForm({
      name: coffee.name || '',
      type: coffee.type || '',
      origin: coffee.origin || '',
      country: coffee.country || '',
      roast_level: coffee.roast_level || 'medium',
      price: coffee.price ?? '',
      description: coffee.description || '',
      acidity_level: coffee.acidity_level || 'medium',
      stock: coffee.stock ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: form.price === '' ? null : Number(form.price),
      stock: Number(form.stock || 0)
    };
    try {
      if (editingId) {
        await coffeeAPI.update(editingId, payload);
        alert('Coffee updated successfully.');
      } else {
        await coffeeAPI.create(payload);
        alert('Coffee created successfully.');
      }
      resetForm();
      fetchCoffees();
    } catch (err) {
      alert(err.message || 'Failed to save coffee.');
    }
  };

  const handleDelete = async (coffeeId) => {
    if (!window.confirm('Delete this coffee from the catalogue?')) return;
    try {
      await coffeeAPI.delete(coffeeId);
      alert('Coffee removed successfully.');
      fetchCoffees();
    } catch (err) {
      alert(err.message || 'Unable to delete coffee.');
    }
  };

  const handleRestock = async (coffee) => {
    const amount = Number(restock[coffee.id] || 0);
    if (!amount || amount <= 0) {
      alert('Enter a quantity greater than zero.');
      return;
    }
    try {
      await coffeeAPI.update(coffee.id, { stock: (coffee.stock || 0) + amount });
      setRestock(prev => ({ ...prev, [coffee.id]: '' }));
      fetchCoffees();
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
        <h1 className="gold-accent" style={{fontSize: '2.6rem', marginBottom: '1rem'}}>☕ Admin • Coffee Roastery</h1>
        <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>
          Manage every roast, origin and batch available to guests. Add new coffees, keep tasting notes current and top up stock instantly.
        </p>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}>
            <input className="luxury-input" placeholder="Name" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            <input className="luxury-input" placeholder="Type (e.g. Arabica)" value={form.type} onChange={(e) => handleInputChange('type', e.target.value)} required />
            <input className="luxury-input" placeholder="Origin" value={form.origin} onChange={(e) => handleInputChange('origin', e.target.value)} />
            <input className="luxury-input" placeholder="Country" value={form.country} onChange={(e) => handleInputChange('country', e.target.value)} />
            <select className="luxury-input" value={form.roast_level} onChange={(e) => handleInputChange('roast_level', e.target.value)}>
              <option value="light">Roast: Light</option>
              <option value="medium">Roast: Medium</option>
              <option value="medium-dark">Roast: Medium-Dark</option>
              <option value="dark">Roast: Dark</option>
            </select>
            <input className="luxury-input" type="number" step="0.01" placeholder="Price (₹)" value={form.price} onChange={(e) => handleInputChange('price', e.target.value)} />
            <select className="luxury-input" value={form.acidity_level} onChange={(e) => handleInputChange('acidity_level', e.target.value)}>
              <option value="low">Acidity: Low</option>
              <option value="medium">Acidity: Medium</option>
              <option value="high">Acidity: High</option>
            </select>
            <input className="luxury-input" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => handleInputChange('stock', e.target.value)} />
          </div>
          <textarea
            className="luxury-input"
            rows={3}
            placeholder="Tasting notes / description"
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="luxury-button" style={{padding: '0.9rem 2.5rem'}}>
              {editingId ? 'Save Changes' : 'Add Coffee'}
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
          placeholder="Search by name, origin, roast level..."
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
            Loading coffees...
          </div>
        ) : filteredCoffees.length === 0 ? (
          <div className="luxury-card" style={{padding: '2rem', textAlign: 'center', color: '#f0ead6'}}>
            No coffees found. Try adjusting your filters.
          </div>
        ) : (
          filteredCoffees.map(coffee => (
            <div key={coffee.id} className="luxury-card" style={{padding: '1.75rem', display: 'grid', gap: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
                <div>
                  <h3 className="gold-accent" style={{marginBottom: '0.3rem'}}>{coffee.name}</h3>
                  <p style={{color: '#f0ead6', margin: 0}}>{coffee.type} • {coffee.origin || 'Unknown origin'} • {coffee.roast_level}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="gold-accent" style={{margin: 0, fontSize: '1.4rem'}}>₹{parseFloat(coffee.price || 0).toLocaleString('en-IN')}</p>
                  <small style={{color: '#f0ead6'}}>Stock: {coffee.stock ?? 0} pack(s)</small>
                </div>
              </div>
              {coffee.description && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0 0'}}>{coffee.description}</p>
              )}
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                  <button className="luxury-button-secondary" onClick={() => startEdit(coffee)}>Edit</button>
                  <button
                    className="luxury-button-secondary"
                    style={{borderColor: 'rgba(220,53,69,0.6)', color: '#ff6b6b'}}
                    onClick={() => handleDelete(coffee.id)}
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
                    value={restock[coffee.id] ?? ''}
                    onChange={(e) => setRestock(prev => ({ ...prev, [coffee.id]: e.target.value }))}
                  />
                  <button className="luxury-button" style={{padding: '0.6rem 1.5rem'}} onClick={() => handleRestock(coffee)}>
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

export default AdminCoffeeManager;
