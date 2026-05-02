const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BACKOFFICE_ROLES = ['admin', 'direktor', 'hodim'];

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tizimga kirish talab etiladi'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token yaroqsiz'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin huquqi talab etiladi'
    });
  }
};

const rolesOnly = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Ruxsat etilmagan'
    });
  }
  next();
};

const backofficeOnly = rolesOnly(...BACKOFFICE_ROLES);

module.exports = { protect, adminOnly, rolesOnly, backofficeOnly, BACKOFFICE_ROLES };
