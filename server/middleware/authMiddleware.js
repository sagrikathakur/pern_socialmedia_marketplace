import { getAuth } from '@clerk/express';



export const protect = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.plan = 'free';
    return next();
  }
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const hasPremiumPlan = auth.has ? auth.has({ role: 'premium' }) : false;
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.code || error.message });
  }
};

export const requireAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.auth = { userId: "test_user_123" };
    return next();
  }

  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Access is denied due to invalid credentials. Please log in.",
    });
  }

  // Attach auth to req for downstream usage
  req.auth = auth;
  next();
};




