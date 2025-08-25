const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);
