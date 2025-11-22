import jwt from "jsonwebtoken"
import {Admin} from "../Models/Admin.model.js"
import {Seller} from "../Models/Seller.model.js"

const auth = (roles = []) => {
  // roles can be a single role string or array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };

      // optionally load user details
      if (decoded.role === 'admin') {

        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) return res.status(401).json({ message: 'Admin user not found' });

        req.user.details = admin;

      } else if (decoded.role === 'seller') {

        const seller = await Seller.findById(decoded.id).select('-password');
        
        if (!seller) return res.status(401).json({ message: 'Seller user not found' });
        req.user.details = seller;
      }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default  auth;
