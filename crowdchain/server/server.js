require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

const app = express();

// Middleware
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://crowdchain.vercel.app",
      "https://event-manegement-with-vlockchain.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

// Connect DB (Now CSV)
connectDB();

// Routes
app.use('/api', apiRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('CrowdChain API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
