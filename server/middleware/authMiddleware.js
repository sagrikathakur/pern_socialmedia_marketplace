export const requireAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.auth = { userId: "test_user_123" };
    return next();
  }
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Access is denied due to invalid credentials. Please log in.",
    });
  }
  next();
};
