const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');
    req.userData = { userId: decodedToken.userId, username: decodedToken.username };
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    return next(error);
  }
}; 