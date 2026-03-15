const supabase = require('../config/supabaseClient');

const getBalance = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', req.user.id)
      .single();

    if (error) return res.status(500).json({ message: 'Error fetching balance' });

    res.status(200).json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStatement = async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        transaction_type,
        created_at,
        sender_id,
        receiver_id
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: 'Error fetching statement' });

    const { data: users } = await supabase.from('users').select('id, name');
    const userMap = {};
    users.forEach((u) => (userMap[u.id] = u.name));

    const enriched = transactions.map((t) => ({
      ...t,
      sender_name: userMap[t.sender_id] || 'Unknown',
      receiver_name: userMap[t.receiver_id] || 'Unknown',
    }));

    res.status(200).json({ transactions: enriched });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const transferMoney = async (req, res) => {
  const { receiverEmail, amount } = req.body;

  try {
    const { data: sender } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const { data: receiver } = await supabase
      .from('users')
      .select('*')
      .eq('email', receiverEmail)
      .single();

    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
    if (receiver.id === sender.id) return res.status(400).json({ message: 'Cannot send money to yourself' });

    await supabase
      .from('users')
      .update({ balance: sender.balance - amount })
      .eq('id', sender.id);

    await supabase
      .from('users')
      .update({ balance: receiver.balance + amount })
      .eq('id', receiver.id);

    await supabase.from('transactions').insert([
      { sender_id: sender.id, receiver_id: receiver.id, amount, transaction_type: 'debit' },
      { sender_id: sender.id, receiver_id: receiver.id, amount, transaction_type: 'credit' },
    ]);

    res.status(200).json({ message: 'Transfer successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email')
      .neq('id', req.user.id);

    if (error) return res.status(500).json({ message: 'Error fetching users' });

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getBalance, getStatement, transferMoney, getAllUsers };
