require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

const app = express();
app.use(express.json());
app.use(cors({
  origin: [process.env.CORS_ORIGIN, 'http://localhost:3000'],
  credentials: true
}));

app.get('/health', (req,res)=>res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/api', sessionRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log('API running on ' + port));
}).catch(err => {
  console.error('Mongo connection error:', err);
  process.exit(1);
});
