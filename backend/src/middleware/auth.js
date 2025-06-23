// Mock authentication middleware for MVP demonstration
export const mockAuth = (req, res, next) => {
  // Extract userId from various sources for demo purposes
  let userId = req.headers['x-user-id'] || 
               req.query.userId || 
               req.params.userId ||
               'alex-chen-2025'; // Default demo user

  // Validate demo user IDs
  const validDemoUsers = [
    'alex-chen-2025',
    'demo-user-2025', 
    'test-student-2025',
    'dr-lena-hassen-2025'
  ];

  if (!validDemoUsers.includes(userId)) {
    userId = 'alex-chen-2025'; // Fallback to primary demo user
  }

  // Attach user info to request
  req.user = {
    id: userId,
    role: userId.includes('dr-') ? 'admin' : 'student',
    createdAt: new Date('2025-01-01T00:00:00Z').toISOString()
  };

  next();
};

// Middleware to require specific user roles (for future admin features)
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          requiredRoles: roles,
          userRole: req.user?.role
        }
      });
    }
    next();
  };
};