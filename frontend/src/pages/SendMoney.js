import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SendMoney = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/account/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleTransfer = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/account/transfer',
        { receiverEmail, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Transfer successful!');
      setReceiverEmail('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topRow}>
          <h2 style={styles.title}>Send Money</h2>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Select Receiver</label>
        <select style={styles.input} value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)}>
          <option value="">-- Select a user --</option>
          {users.map((u) => (
            <option key={u.id} value={u.email}>{u.name} ({u.email})</option>
          ))}
        </select>
        <label style={styles.label}>Amount (₹)</label>
        <input style={styles.input} type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button style={styles.button} onClick={handleTransfer} disabled={loading}>
          {loading ? 'Sending...' : 'Send Money'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#333' },
  backBtn: { padding: '8px 12px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  success: { color: 'green', marginBottom: '12px', textAlign: 'center' },
  error: { color: 'red', marginBottom: '12px', textAlign: 'center' },
};

export default SendMoney;
