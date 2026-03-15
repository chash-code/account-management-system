import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/account/balance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchBalance();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.welcome}>Welcome, {user?.name} 👋</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
      <div style={styles.balanceCard}>
        <p style={styles.balanceLabel}>Current Balance</p>
        {loading ? <p>Loading...</p> : <h1 style={styles.balance}>₹{balance?.toLocaleString()}</h1>}
      </div>
      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={() => navigate('/send-money')}>💸 Send Money</button>
        <button style={styles.actionBtn} onClick={() => navigate('/statement')}>📄 Account Statement</button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  welcome: { color: '#333', margin: 0 },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  balanceCard: { backgroundColor: '#4f46e5', color: '#fff', padding: '32px', borderRadius: '16px', textAlign: 'center', marginBottom: '24px' },
  balanceLabel: { fontSize: '14px', opacity: 0.8, margin: 0 },
  balance: { fontSize: '48px', margin: '8px 0 0' },
  actions: { display: 'flex', gap: '16px' },
  actionBtn: { flex: 1, padding: '16px', backgroundColor: '#fff', border: '2px solid #4f46e5', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', color: '#4f46e5', fontWeight: 'bold' },
};

export default Dashboard;
