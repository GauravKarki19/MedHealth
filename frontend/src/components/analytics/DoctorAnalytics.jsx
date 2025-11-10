import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import httpClient from '../../httpClient';
import GlassCard from '../common/GlassCard';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';
import { TrendingUp, Users, Calendar, Star, DollarSign } from 'lucide-react';

const DoctorAnalytics = () => {
  const { isDarkMode } = useDarkMode();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString();

      const response = await httpClient.get('/analytics/doctor', {
        params: { startDate, endDate }
      });

      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  // Prepare data for charts
  const appointmentsByStatus = analytics.appointmentsByStatus?.map(item => ({
    name: item._id,
    count: item.count
  })) || [];

  const appointmentsByMonth = analytics.appointmentsByMonth?.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    count: item.count
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const stats = [
    {
      label: 'Total Appointments',
      value: analytics.totalAppointments || 0,
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      label: 'Average Rating',
      value: analytics.averageRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      label: 'Total Reviews',
      value: analytics.totalRatings || 0,
      icon: Users,
      color: 'text-green-500'
    },
    {
      label: 'Total Revenue',
      value: `₹${analytics.totalRevenue || 0}`,
      icon: DollarSign,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={`space-y-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`
            px-4 py-2 rounded-lg border
            ${isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
            }
          `}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`${stat.color} w-8 h-8`} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status */}
        <GlassCard>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appointments by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Appointments by Month */}
        <GlassCard>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appointments Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

export default DoctorAnalytics;

