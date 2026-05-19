const https = require('https');
const pool = require('../config/database');

const SUPPORTED_CURRENCIES = ['INR','USD','EUR','GBP','AED','SGD','AUD','CAD','JPY','CHF'];

exports.getSupportedCurrencies = (req, res) => {
  res.json(SUPPORTED_CURRENCIES);
};

exports.getExchangeRates = async (req, res) => {
  const base = req.query.base || 'INR';
  // Using exchangerate-api free tier
  const url = `https://open.er-api.com/v6/latest/${base}`;
  https.get(url, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const rates = {};
        SUPPORTED_CURRENCIES.forEach(c => { if (parsed.rates[c]) rates[c] = parsed.rates[c]; });
        res.json({ base, rates, updated: parsed.time_last_update_utc });
      } catch (e) {
        // Fallback static rates relative to INR
        res.json({
          base: 'INR',
          rates: { INR:1, USD:0.012, EUR:0.011, GBP:0.0095, AED:0.044, SGD:0.016, AUD:0.018, CAD:0.016, JPY:1.78, CHF:0.011 },
          updated: new Date().toISOString(),
          source: 'fallback'
        });
      }
    });
  }).on('error', () => {
    res.json({
      base: 'INR',
      rates: { INR:1, USD:0.012, EUR:0.011, GBP:0.0095, AED:0.044, SGD:0.016, AUD:0.018, CAD:0.016, JPY:1.78, CHF:0.011 },
      updated: new Date().toISOString(),
      source: 'fallback'
    });
  });
};

exports.updatePreferredCurrency = async (req, res) => {
  const { currency } = req.body;
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    return res.status(400).json({ message: 'Unsupported currency' });
  }
  try {
    await pool.query('UPDATE users SET preferred_currency=$1 WHERE id=$2', [currency, req.userId]);
    res.json({ message: 'Currency updated', currency });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
