const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { buildCreatedAtFilter } = require('../utils/dateRange');

const DASHBOARD_TIMEZONE = process.env.DASHBOARD_TIMEZONE || 'Asia/Tashkent';

// Helper: build stats for a date range
async function buildRangeStats(startDate, endDate) {
  const createdAt = buildCreatedAtFilter(startDate, endDate);
  const matchStage = createdAt ? { createdAt } : {};

  const orderCostExpr = {
    $reduce: {
      input: '$items',
      initialValue: 0,
      in: {
        $add: [
          '$$value',
          { $multiply: [{ $ifNull: ['$$this.costPrice', 0] }, '$$this.quantity'] }
        ]
      }
    }
  };

  // Users & products created in this period
  const newUsers = createdAt
    ? await User.countDocuments({ createdAt, role: 'user' })
    : await User.countDocuments({ role: 'user' });
  const newProducts = createdAt
    ? await Product.countDocuments({ createdAt })
    : await Product.countDocuments();

  // Orders by status + revenue/cost per status (single pass)
  const statusAgg = await Order.aggregate([
    { $match: matchStage },
    { $addFields: { orderCost: orderCostExpr } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$finalPrice' },
        cost: { $sum: '$orderCost' }
      }
    }
  ]);
  const ordersByStatus = statusAgg.map(s => ({ _id: s._id, count: s.count }));

  const totalOrders = statusAgg.reduce((sum, s) => sum + (s.count || 0), 0);
  const totalRevenue = statusAgg.reduce((sum, s) => sum + (s.revenue || 0), 0);
  const totalCost = statusAgg.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const delivered = statusAgg.find(s => s._id === 'yetkazildi') || { count: 0, revenue: 0, cost: 0 };
  const deliveredOrders = delivered.count || 0;
  const deliveredRevenue = delivered.revenue || 0;
  const deliveredCost = delivered.cost || 0;
  const deliveredProfit = deliveredRevenue - deliveredCost;

  // Monthly revenue
  const monthlyRevenue = await Order.aggregate([
    { $match: matchStage },
    { $addFields: { orderCost: orderCostExpr, parts: { $dateToParts: { date: '$createdAt', timezone: DASHBOARD_TIMEZONE } } } },
    {
      $group: {
        _id: { year: '$parts.year', month: '$parts.month' },
        revenue: { $sum: '$finalPrice' },
        cost: { $sum: '$orderCost' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Daily orders
  const dailyOrders = await Order.aggregate([
    { $match: matchStage },
    { $addFields: { orderCost: orderCostExpr, day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: DASHBOARD_TIMEZONE } } } },
    {
      $group: {
        _id: '$day',
        count: { $sum: 1 },
        revenue: { $sum: '$finalPrice' },
        cost: { $sum: '$orderCost' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    totalOrders,
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin,
    avgOrderValue,
    deliveredOrders,
    deliveredRevenue,
    deliveredCost,
    deliveredProfit,
    newUsers,
    newProducts,
    ordersByStatus,
    monthlyRevenue,
    dailyOrders
  };
}

// GET /api/admin/dashboard?startDate=...&endDate=...&compareStartDate=...&compareEndDate=...
const getDashboardStats = async (req, res, next) => {
  try {
    const { startDate, endDate, compareStartDate, compareEndDate } = req.query;

    // Global totals (always)
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();

    // Main period stats
    const mainStats = await buildRangeStats(startDate, endDate);

    // Recent orders (always latest 10)
    const recentCreatedAt = buildCreatedAtFilter(
      compareStartDate && compareEndDate ? compareStartDate : startDate,
      compareStartDate && compareEndDate ? compareEndDate : endDate
    );
    const recentOrders = await Order.find(recentCreatedAt ? { createdAt: recentCreatedAt } : {})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const result = {
      totalUsers,
      totalProducts,
      ...mainStats,
      recentOrders
    };

    // Comparison period
    if (compareStartDate && compareEndDate) {
      const compareStats = await buildRangeStats(compareStartDate, compareEndDate);

      const calcChange = (current, previous) => {
        if (previous === 0) return current > 0 ? null : 0; // null = yangi (no base to compare)
        return Math.round(((current - previous) / previous) * 100);
      };

      result.comparison = {
        ...compareStats,
        changes: {
          // IMPORTANT: change is Period2 (compare*) relative to Period1 (start/end)
          ordersChange: calcChange(compareStats.totalOrders, mainStats.totalOrders),
          revenueChange: calcChange(compareStats.totalRevenue, mainStats.totalRevenue),
          costChange: calcChange(compareStats.totalCost, mainStats.totalCost),
          profitChange: calcChange(compareStats.totalProfit, mainStats.totalProfit),
          deliveredOrdersChange: calcChange(compareStats.deliveredOrders, mainStats.deliveredOrders),
          usersChange: calcChange(compareStats.newUsers, mainStats.newUsers),
          productsChange: calcChange(compareStats.newProducts, mainStats.newProducts),
        }
      };
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { startDate, endDate, role, search } = req.query;
    const createdAt = buildCreatedAtFilter(startDate, endDate);

    const query = {};
    if (createdAt) query.createdAt = createdAt;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Noto\'g\'ri rol' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }
    res.json({ success: true, message: 'Foydalanuvchi o\'chirildi' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getUsers, updateUserRole, deleteUser };
