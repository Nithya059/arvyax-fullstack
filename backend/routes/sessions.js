const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

function auth(req,res,next){
  const raw = req.headers.authorization || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : null;
  if(!token) return res.status(401).json({ message: 'No token' });
  try{ req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch{ return res.status(401).json({ message: 'Invalid token' }); }
}

// Public: list published
router.get('/sessions', async (req,res)=>{
  const list = await Session.find({ status: 'published' }).sort('-published_at');
  res.json(list);
});

// Private: list mine (draft + published)
router.get('/my-sessions', auth, async (req,res)=>{
  const list = await Session.find({ user_id: req.user.id }).sort('-updated_at');
  res.json(list);
});

// Private: create or update a draft (auto-save)
router.put('/my-sessions/:id', auth, async (req,res)=>{
  const { title, tags, json_file_url } = req.body;
  const s = await Session.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    { $set: { title, tags, json_file_url } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(s);
});

// Private: publish
router.post('/my-sessions/publish/:id', auth, async (req,res)=>{
  const s = await Session.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    { status: 'published', published_at: new Date() },
    { new: true }
  );
  res.json(s);
});

module.exports = router;
