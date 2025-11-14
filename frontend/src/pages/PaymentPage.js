import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CheckoutPage.css';
import { orderAPI } from '../services/api';
import {
  getActiveUserFromStorage,
  getCartStorageKey,
  getLastOrderStorageKey,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from '../utils/storage';

const DEFAULT_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  deliveryInstructions: '',
  saveDetails: true,
};

const mapProfileToForm = (profile = {}) => ({
  fullName: profile.full_name || profile.fullName || '',
  phone: profile.phone || '',
  addressLine1: profile.address_line1 || profile.addressLine1 || '',
  addressLine2: profile.address_line2 || profile.addressLine2 || '',
  city: profile.city || '',
  state: profile.state || '',
  postalCode: profile.postal_code || profile.postalCode || '',
  country: profile.country || 'India',
  deliveryInstructions: profile.delivery_instructions || profile.deliveryInstructions || '',
  saveDetails: profile.saveDetails !== undefined ? profile.saveDetails : true,
});

const toProfileRecord = (form) => ({
  full_name: form.fullName,
  phone: form.phone,
  address_line1: form.addressLine1,
  address_line2: form.addressLine2,
  city: form.city,
  state: form.state,
  postal_code: form.postalCode,
  country: form.country,
  delivery_instructions: form.deliveryInstructions,
  payment_method: 'cod',
  saveDetails: form.saveDetails,
});

const PaymentPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const activeUser = currentUser || getActiveUserFromStorage();
  const cartStorageKey = getCartStorageKey(activeUser);
  const lastOrderStorageKey = getLastOrderStorageKey(activeUser);
  const checkoutDraftKey = `checkoutDraft_${activeUser?.id || 'guest'}`;
  const profileStorageKey = activeUser?.id ? `paymentProfile_${activeUser.id}` : null;

  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = loadFromStorage(checkoutDraftKey, null);
    const draftCart = draft?.cart;
    const storedCart = Array.isArray(draftCart) ? draftCart : loadFromStorage(cartStorageKey, []);

    if (!storedCart || !storedCart.length) {
      navigate('/checkout', { replace: true });
      return;
    }

    setCart(storedCart);

    if (draft?.formData) {
      setFormData(prev => ({
        ...prev,
        ...draft.formData,
      }));
      return;
    }

    if (profileStorageKey) {
      const savedProfile = loadFromStorage(profileStorageKey, null);
      if (savedProfile) {
        setFormData(prev => ({
          ...prev,
          ...mapProfileToForm(savedProfile),
        }));
      }
    }
  }, [cartStorageKey, checkoutDraftKey, navigate, profileStorageKey]);

  const total = useMemo(() => cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (parseFloat(item.price || 0) * quantity);
  }, 0), [cart]);

  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + (item.quantity || 1), 0), [cart]);

  const handleToggleSaveDetails = (checked) => {
    setFormData(prev => ({
      ...prev,
      saveDetails: checked,
    }));
  };

  const handleConfirmPayment = async () => {
    if (!cart.length) {
      navigate('/checkout', { replace: true });
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      // Prepare order data for backend
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_type: item.category || (item.region ? 'wine' : 'coffee'),
        name: item.name,
        category: item.category || (item.region ? 'wine' : 'coffee'),
        quantity: item.quantity || 1,
        price: parseFloat(item.price || 0),
      }));

      const orderPayload = {
        userId: activeUser?.id,
        items: orderItems,
        shipping: {
          full_name: formData.fullName,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          delivery_instructions: formData.deliveryInstructions,
        },
        total: total,
        saveDetails: formData.saveDetails,
      };

      // Save order to backend
      const response = await orderAPI.create(orderPayload);
      console.log('Order saved to backend:', response);

      // Show success message
      const confirmationLines = [
        '✅ Payment Successful!',
        '',
        `Order ID: #${response.order?.id || 'Pending'}`,
        `Total Amount: ₹${total.toLocaleString('en-IN')}`,
        '',
        'Your order has been placed successfully.',
        '',
        'Delivery Address:',
        formData.fullName || '—',
        formData.addressLine1 || '',
      ];
      if (formData.addressLine2) confirmationLines.push(formData.addressLine2);
      confirmationLines.push(`${formData.city || ''}, ${formData.state || ''} - ${formData.postalCode || ''}`);
      confirmationLines.push(formData.country || '');
      confirmationLines.push('');
      confirmationLines.push(`Contact: ${formData.phone || '—'}`);
      if (formData.deliveryInstructions) {
        confirmationLines.push('');
        confirmationLines.push(`Delivery Notes: ${formData.deliveryInstructions}`);
      }

      // Save to local storage for rate page
      const lastOrderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || (item.region ? 'wine' : 'coffee'),
        quantity: item.quantity || 1,
      }));

      saveToStorage(lastOrderStorageKey, lastOrderItems);
      
      // Clear cart and checkout draft
      removeFromStorage(cartStorageKey);
      removeFromStorage(checkoutDraftKey);

      // Save profile if requested
      if (profileStorageKey) {
        if (formData.saveDetails) {
          saveToStorage(profileStorageKey, toProfileRecord(formData));
        } else {
          removeFromStorage(profileStorageKey);
        }
      }

      setSuccessMessage(confirmationLines.join('\n'));
      setTimeout(() => navigate('/rate', { replace: true }), 1800);
    } catch (error) {
      console.error('Failed to save order to backend:', error);
      setSubmitting(false);
      alert(`Error placing order: ${error.message || 'Please try again'}`);
    }
  };

  const handleBackToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title gold-accent">PAYMENT</h1>

      <div className="checkout-container luxury-card" style={{ maxWidth: '960px', margin: '0 auto' }}>
        {successMessage ? (
          <div
            role="status"
            style={{
              background: 'rgba(34, 139, 34, 0.18)',
              border: '1px solid rgba(34, 139, 34, 0.45)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              color: '#d8f8d8',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {successMessage}
          </div>
        ) : (
          <>
            <section style={{ marginBottom: '2rem' }}>
              <h2 className="gold-accent" style={{ marginBottom: '1rem' }}>Review & Confirm</h2>
              <p style={{ color: '#f0ead6', lineHeight: 1.6 }}>
                Cash on Delivery is selected. Please review your order and delivery details.
                We will collect payment when the order reaches your doorstep.
              </p>
            </section>

            <section style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)' }}>
              <div className="luxury-card" style={{ padding: '1.75rem', background: 'rgba(0,0,0,0.35)' }}>
                <h3 className="gold-accent" style={{ marginBottom: '1rem' }}>Delivery Details</h3>
                <div style={{ display: 'grid', gap: '0.75rem', color: '#f0ead6' }}>
                  <div>
                    <strong className="gold-accent">Recipient:</strong> {formData.fullName || '—'}
                  </div>
                  <div>
                    <strong className="gold-accent">Phone:</strong> {formData.phone || '—'}
                  </div>
                  <div>
                    <strong className="gold-accent">Address:</strong>
                    <div style={{ marginTop: '0.25rem', lineHeight: 1.6 }}>
                      <div>{formData.addressLine1 || '—'}</div>
                      {formData.addressLine2 && <div>{formData.addressLine2}</div>}
                      <div>{`${formData.city || ''}, ${formData.state || ''} ${formData.postalCode || ''}`}</div>
                      <div>{formData.country || ''}</div>
                    </div>
                  </div>
                  {formData.deliveryInstructions && (
                    <div>
                      <strong className="gold-accent">Instructions:</strong>
                      <div style={{ marginTop: '0.25rem' }}>{formData.deliveryInstructions}</div>
                    </div>
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.saveDetails}
                      onChange={(e) => handleToggleSaveDetails(e.target.checked)}
                      style={{ width: '1.1rem', height: '1.1rem' }}
                    />
                    <span style={{ color: '#f0ead6' }}>Save these details for next time</span>
                  </label>
                </div>
                <button
                  className="luxury-button-secondary"
                  style={{ marginTop: '1.5rem' }}
                  type="button"
                  onClick={handleBackToCheckout}
                >
                  ← Edit Details
                </button>
              </div>

              <aside className="luxury-card" style={{ padding: '1.75rem', background: 'rgba(0,0,0,0.25)' }}>
                <h3 className="gold-accent" style={{ marginBottom: '1rem' }}>Order Summary</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {cart.map((item, index) => {
                    const quantity = item.quantity || 1;
                    return (
                      <div key={`${item.id}-${index}`} style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.75rem' }}>
                        <p className="gold-accent" style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{item.name}</p>
                        <p style={{ color: '#f0ead6', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          Qty: {quantity}
                        </p>
                        <p style={{ color: '#ffcf4d', fontWeight: 600 }}>
                          ₹{(parseFloat(item.price || 0) * quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid rgba(212,175,55,0.3)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                  <p style={{ color: '#f0ead6', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Items ({itemCount})</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </p>
                  <p style={{ color: '#f0ead6', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Delivery</span>
                    <span className="gold-accent">Complimentary</span>
                  </p>
                  <p style={{ color: '#f0ead6', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    <span>Total Due</span>
                    <span className="gold-accent" style={{ fontWeight: 700 }}>₹{total.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <button
                  type="button"
                  className="luxury-button"
                  style={{ width: '100%', marginTop: '1rem', padding: '1rem 1.5rem', fontSize: '1.1rem' }}
                  onClick={handleConfirmPayment}
                  disabled={submitting}
                >
                  {submitting ? 'Finalising…' : 'Confirm & Place Order'}
                </button>
              </aside>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;




