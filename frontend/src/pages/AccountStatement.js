import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountStatement = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/account/statement', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStatement();
  }, [token]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <h2 style={styles.title}>Account Statement</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p style={styles.noData}>No transactions found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isCredit = t.transaction_type === 'credit' && t.receiver_id === user?.id;
                return (
                  <tr key={t.id} style={{ backgroundColor: isCredit ? '#dcfce7' : '#fee2e2' }}>
                    <td style={styles.td}>{formatDate(t.created_at)}</td>
                    <td style={{ ...styles.td, color: isCredit ? 'green' : 'red', fontWeight: 'bold' }}>
                      {isCredit ? 'Credit' : 'Debit'}
                    </td>
                    <td style={styles.td}>₹{t.amount}</td>
                    <td style={styles.td}>{t.sender_name}</td>
                    <td style={styles.td}>{t.receiver_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#333' },
  backBtn: { padding: '8px 12px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#4f46e5', color: '#fff' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#fff' },
  td: { padding: '12px 16px', borderBottom: '1px solid #e5e7eb' },
  noData: { textAlign: 'center', color: '#999', marginTop: '40px' },
};

export default AccountStatement;
