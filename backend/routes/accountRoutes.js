const express = require('express');
const router = express.Router();
const { getBalance, getStatement, transferMoney, getAllUsers } = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/balance', authMiddleware, getBalance);
router.get('/statement', authMiddleware, getStatement);
router.post('/transfer', authMiddleware, transferMoney);
router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
