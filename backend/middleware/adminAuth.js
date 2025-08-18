import User from '../model/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    // Check if admin email is present (from admin login)
    if (req.adminEmail) {
      // For admin login, just verify the email matches
      if (req.adminEmail === process.env.ADMIN_EMAIL) {
        console.log('Admin auth successful for email:', req.adminEmail);
        next();
        return;
      }
    }
    
    // Fallback: check if user is admin (for regular user tokens)
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user && user.isAdmin) {
        console.log('Admin auth successful for user ID:', req.userId);
        next();
        return;
      }
    }
    
    console.log('Admin auth failed - no valid admin credentials');
    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Admin check failed' });
  }
};

export default adminAuth;