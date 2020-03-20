const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // I get the 1st and 2nd value of the string, but I just take the 2nd value
  const [, token] = authHeader.split(' ');

  try {
    // Making a callback function in async await
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Add id of user to requests
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
