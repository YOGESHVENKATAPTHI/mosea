// errorHandler.js – Global error middleware that returns JSON error responses.
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};