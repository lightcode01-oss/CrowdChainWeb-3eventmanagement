const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();
const { readAll, insertRecord } = require('../utils/csvStore');

exports.walletLogin = async (req, res) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'Missing address, signature, or message' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    // Check if user exists, if not create
    const users = readAll('users');
    let user = users.find(u => u.walletAddress === address.toLowerCase());
    
    if (!user) {
      user = {
        id: uuidv4(),
        walletAddress: address.toLowerCase(),
        role: 'user',
        createdAt: new Date().toISOString()
      };
      insertRecord('users', user);
    }

    // Frontend expects _id for consistency, so map it
    const mappedUser = { ...user, _id: user.id };

    // Create JWT
    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ user: mappedUser, token });

  } catch (error) {
    console.error('Wallet Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
