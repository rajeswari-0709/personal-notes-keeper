// Protects API routes - only logged in users can pass
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: 'Not authorized. Please log in.' });
};

module.exports = requireAuth;
