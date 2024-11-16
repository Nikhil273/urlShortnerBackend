// api/shorten.js
const shortid = require('shortid');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  long_url: { type: String, required: true },
  short_code: { type: String, unique: true },
});
const URL = mongoose.model('URL', urlSchema);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { long_url } = req.body;
    const short_code = shortid.generate();

    const newURL = new URL({ long_url, short_code });
    await newURL.save();

    res.status(200).json({ short_url: `https://your-vercel-url.vercel.app/${short_code}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
