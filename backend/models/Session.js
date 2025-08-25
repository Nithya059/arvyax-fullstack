const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  tags: { type: [String], default: [] },
  json_file_url: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  published_at: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Session', sessionSchema);
