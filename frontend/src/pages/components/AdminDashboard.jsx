// src/components/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL = 30000; // 30 seconds

const AdminDashboard = () => {
  const navigate = useNavigate();
  const pollRef = useRef(null);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalServices: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    pastCompleted: 0,
    recentBookings: [],
    upcomingBookingsList: [],
    predictionData: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    fetchDashboardStats();
    pollRef.current = setInterval(() => {
      fetchDashboardStats(false);
    }, POLL_INTERVAL);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const fetchDashboardStats = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      setError('Not authenticated as admin. Redirecting...');
      setTimeout(() => navigate('/admin-login'), 2000);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/stats/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard Data:', data); // Debug
        setStats(data);
        setError('');
        setLastUpdated(new Date());
      } else {
        const errorText = await response.text();
        setError(`API Error ${response.status}: ${errorText}`);
        
        if (response.status === 401) {
          localStorage.clear();
          navigate('/admin-login');
        }
      }
    } catch (err) {
      setError(`Network Error: ${err.message}`);
    }
    
    setLoading(false);
  };

  const refreshData = () => {
    setLoading(true);
    fetchDashboardStats();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  // Overview Tab Content
  const renderOverviewTab = () => (
    <>
      <div className="section-header">
        <h2>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard Overview
        </h2>
        <div className="auto-refresh-indicator">
          <span className="refresh-dot"></span>
          Auto-refresh: {POLL_INTERVAL / 1000}s
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card users-card">
          <div className="stat-background">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-description">Registered accounts</div>
          </div>
          <div className="stat-trend">
            <i className="bi bi-graph-up text-success"></i>
          </div>
        </div>

        <div className="stat-card bookings-card">
          <div className="stat-background">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
            <div className="stat-description">{stats.todayBookings} today, {stats.upcomingBookings || 0} upcoming</div>
          </div>
          <div className="stat-trend">
            <i className="bi bi-graph-up text-success"></i>
          </div>
        </div>

        <div className="stat-card services-card">
          <div className="stat-background">
            <i className="bi bi-tools"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalServices}</div>
            <div className="stat-label">Active Services</div>
            <div className="stat-description">Service offerings</div>
          </div>
          <div className="stat-trend">
            <i className="bi bi-check-circle text-info"></i>
          </div>
        </div>

        <div className="stat-card revenue-card">
          <div className="stat-background">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-description">Earnings to date</div>
          </div>
          <div className="stat-trend">
            <i className="bi bi-graph-up text-success"></i>
          </div>
        </div>
      </div>

      {/* Status Metrics */}
      <div className="status-metrics">
        <div className="section-header">
          <h3>
            <i className="bi bi-pie-chart me-2"></i>
            Service Status Breakdown
          </h3>
        </div>
        
        <div className="status-grid">
          <div className="status-item pending">
            <div className="status-icon">
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="status-details">
              <div className="status-number">{stats.pendingBookings}</div>
              <div className="status-label">Pending</div>
              <div className="status-bar">
                <div className="status-progress pending-progress" 
                     style={{width: `${(stats.pendingBookings / (stats.totalBookings || 1)) * 100}%`}}>
                </div>
              </div>
            </div>
          </div>

          <div className="status-item completed">
            <div className="status-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="status-details">
              <div className="status-number">{stats.completedBookings}</div>
              <div className="status-label">Completed Services</div>
              <div className="status-bar">
                <div className="status-progress completed-progress" 
                     style={{width: `${(stats.completedBookings / (stats.totalBookings || 1)) * 100}%`}}>
                </div>
              </div>
            </div>
          </div>

          <div className="status-item upcoming">
            <div className="status-icon">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div className="status-details">
              <div className="status-number">{stats.upcomingBookings || 0}</div>
              <div className="status-label">Upcoming Services</div>
              <div className="status-bar">
                <div className="status-progress upcoming-progress" 
                     style={{width: `${((stats.upcomingBookings || 0) / (stats.totalBookings || 1)) * 100}%`}}>
                </div>
              </div>
            </div>
          </div>

          <div className="status-item today">
            <div className="status-icon">
              <i className="bi bi-calendar-day"></i>
            </div>
            <div className="status-details">
              <div className="status-number">{stats.todayBookings}</div>
              <div className="status-label">Today's Services</div>
              <div className="status-bar">
                <div className="status-progress today-progress" 
                     style={{width: `${(stats.todayBookings / (stats.totalBookings || 1)) * 100}%`}}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <h3>
            <i className="bi bi-activity me-2"></i>
            Recent Activity
          </h3>
          {stats.recentBookings.length > 0 && (
            <span className="activity-count">
              {stats.recentBookings.length} recent bookings
            </span>
          )}
        </div>

        <div className="activity-content">
          {stats.recentBookings && stats.recentBookings.length > 0 ? (
            <div className="bookings-table-container">
              <div className="table-responsive">
                <table className="table bookings-table">
                  <thead>
                    <tr>
                      <th>Booking</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map(booking => {
                      const bookingDate = new Date(booking.date || booking.created_at);
                      const today = new Date();
                      const isUpcoming = bookingDate > today;
                      const isToday = bookingDate.toDateString() === today.toDateString();
                      const isPast = bookingDate < today;
                      
                      return (
                        <tr key={booking.id} className={`booking-row ${
                          isUpcoming ? 'upcoming-row' : isPast ? 'past-row' : 'today-row'
                        }`}>
                          <td>
                            <div className="booking-id">
                              <i className="bi bi-hash"></i>
                              {booking.id}
                            </div>
                          </td>
                          <td>
                            <div className="customer-info">
                              <div className="customer-name">{booking.user__username}</div>
                              <div className="customer-email">{booking.user__email}</div>
                            </div>
                          </td>
                          <td>
                            <div className="service-name">{booking.service__name}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${
                              booking.status === 'completed' ? 'completed' :
                              booking.status === 'pending' ? 'pending' : 
                              booking.status === 'cancelled' ? 'cancelled' : 'default'
                            }`}>
                              <i className={`bi ${
                                booking.status === 'completed' ? 'bi-check-circle' :
                                booking.status === 'pending' ? 'bi-clock' : 
                                booking.status === 'cancelled' ? 'bi-x-circle' : 'bi-circle'
                              } me-1`}></i>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="booking-date">
                              {bookingDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td>
                            <span className={`date-type ${
                              isUpcoming ? 'upcoming' : isToday ? 'today' : 'past'
                            }`}>
                              {isUpcoming ? 'Upcoming' : isToday ? 'Today' : 'Past'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-sm btn-outline-primary" title="View Details">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" title="Edit">
                                <i className="bi bi-pencil"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-activity">
              <div className="no-activity-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
              <h5>No Recent Activity</h5>
              <p>No recent bookings found. New bookings will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Upcoming Services Tab Content
  const renderUpcomingTab = () => (
    <div className="upcoming-services-view">
      <div className="section-header">
        <h2>
          <i className="bi bi-calendar-event me-2"></i>
          Upcoming Services Schedule
        </h2>
        <div className="upcoming-stats">
          <span className="upcoming-count">
            {stats.upcomingBookings || 0} scheduled services
          </span>
        </div>
      </div>

      <div className="activity-content">
        {stats.upcomingBookingsList && stats.upcomingBookingsList.length > 0 ? (
          <div className="bookings-table-container">
            <div className="table-responsive">
              <table className="table bookings-table upcoming-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Scheduled Date</th>
                    <th>Days Until Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.upcomingBookingsList.map(booking => {
                    const bookingDate = new Date(booking.date);
                    const today = new Date();
                    const daysUntil = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={booking.id} className="booking-row upcoming-row">
                        <td>
                          <div className="booking-id">
                            <i className="bi bi-hash"></i>
                            {booking.id}
                          </div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">{booking.user__username}</div>
                            <div className="customer-email">{booking.user__email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="service-name">{booking.service__name}</div>
                        </td>
                        <td>
                          <span className="status-badge upcoming">
                            <i className="bi bi-calendar-event me-1"></i>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="booking-date upcoming-date">
                            {bookingDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td>
                          <div className={`days-until ${
                            daysUntil <= 1 ? 'urgent' : 
                            daysUntil <= 3 ? 'soon' : 
                            daysUntil <= 7 ? 'week' : 'later'
                          }`}>
                            {daysUntil === 0 ? 'Today' : 
                             daysUntil === 1 ? 'Tomorrow' : 
                             `${daysUntil} days`}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-outline-primary" title="View Details">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" title="Edit">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Mark as Completed">
                              <i className="bi bi-check"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="no-activity">
            <div className="no-activity-icon">
              <i className="bi bi-calendar-plus"></i>
            </div>
            <h5>No Upcoming Services</h5>
            <p>No future bookings scheduled. New bookings will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Prediction Charts (your existing code)
  const renderPredictionCharts = () => {
    const { predictionData } = stats;
    
    if (!predictionData || !predictionData.monthlyTrend) {
      return (
        <div className="no-activity">
          <div className="no-activity-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <h5>No Prediction Data</h5>
          <p>Prediction data will be available once you have sufficient booking history.</p>
        </div>
      );
    }

    return (
      <div className="predictions-view">
        {/* Prediction Summary Cards */}
        <div className="prediction-summary">
          <div className="summary-cards">
            <div className="summary-card growth">
              <div className="summary-icon">
                <i className="bi bi-trending-up"></i>
              </div>
              <div className="summary-content">
                <h3>{predictionData.summary?.predictedGrowthRate?.toFixed(1)}%</h3>
                <p>Predicted Growth Rate</p>
                <small>Based on recent trends</small>
              </div>
            </div>
            
            <div className="summary-card confidence">
              <div className="summary-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="summary-content">
                <h3>{predictionData.summary?.confidenceLevel}%</h3>
                <p>Confidence Level</p>
                <small>Prediction accuracy</small>
              </div>
            </div>
            
            <div className="summary-card next-month">
              <div className="summary-icon">
                <i className="bi bi-calendar-plus"></i>
              </div>
              <div className="summary-content">
                <h3>{predictionData.summary?.nextMonthBookings}</h3>
                <p>Next Month Bookings</p>
                <small>Predicted volume</small>
              </div>
            </div>
            
            <div className="summary-card revenue">
              <div className="summary-icon">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <div className="summary-content">
                <h3>${predictionData.summary?.nextMonthRevenue?.toFixed(0)}</h3>
                <p>Next Month Revenue</p>
                <small>Predicted earnings</small>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              <i className="bi bi-graph-up me-2"></i>
              Monthly Booking Trends & Predictions
            </h3>
          </div>
          <div className="chart-content">
            <div className="monthly-chart">
              {predictionData.monthlyTrend?.map((month, index) => (
                <div key={index} className={`chart-bar ${month.type}`}>
                  <div 
                    className="bar-fill"
                    style={{
                      height: `${Math.max(month.bookings * 3, 10)}px`,
                      maxHeight: '200px'
                    }}
                  ></div>
                  <div className="bar-label">
                    <strong>{month.bookings}</strong>
                    <small>{month.month.substring(0, 3)}</small>
                    {month.type === 'predicted' && (
                      <span className="prediction-indicator">📈</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span className="legend-item actual">
                <span className="legend-color"></span>
                Actual Data
              </span>
              <span className="legend-item predicted">
                <span className="legend-color"></span>
                Predicted Data
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Predictions */}
        <div className="weekly-predictions-container">
          <div className="chart-header">
            <h3>
              <i className="bi bi-calendar-week me-2"></i>
              Weekly Predictions (Next 4 Weeks)
            </h3>
          </div>
          <div className="weekly-grid">
            {predictionData.weeklyPredictions?.map((week, index) => (
              <div key={index} className="weekly-card">
                <div className="weekly-header">
                  <h4>{week.week}</h4>
                  <small>{new Date(week.date).toLocaleDateString()}</small>
                </div>
                <div className="weekly-prediction">
                  <div className="prediction-number">{week.predictedBookings}</div>
                  <div className="prediction-label">Expected Bookings</div>
                </div>
                <div className="confidence-bar">
                  <div className="confidence-label">Confidence: {(week.confidence * 100).toFixed(0)}%</div>
                  <div className="confidence-progress">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${week.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Demand Predictions */}
        <div className="service-predictions-container">
          <div className="chart-header">
            <h3>
              <i className="bi bi-tools me-2"></i>
              Service Demand Predictions
            </h3>
          </div>
          <div className="services-grid">
            {predictionData.servicePredictions?.map((service, index) => (
              <div key={index} className="service-prediction-card">
                <div className="service-name">{service.serviceName}</div>
                <div className="demand-comparison">
                  <div className="demand-item current">
                    <span className="demand-number">{service.currentDemand}</span>
                    <span className="demand-label">Current</span>
                  </div>
                  <div className="demand-arrow">
                    <i className="bi bi-arrow-right"></i>
                  </div>
                  <div className="demand-item predicted">
                    <span className="demand-number">{service.predictedDemand}</span>
                    <span className="demand-label">Predicted</span>
                  </div>
                </div>
                <div className="growth-indicator">
                  <i className="bi bi-graph-up-arrow text-success"></i>
                  +{service.growthRate}% growth expected
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-container">
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading Admin Dashboard...</h4>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Professional Header */}
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="admin-info">
              <div className="admin-avatar">
                <i className="bi bi-person-gear"></i>
              </div>
              <div className="admin-details">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, <strong>{localStorage.getItem('username')}</strong></p>
                {lastUpdated && (
                  <small>
                    <i className="bi bi-clock me-1"></i>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </small>
                )}
              </div>
            </div>
            <div className="header-actions">
              <button onClick={refreshData} className="btn btn-light me-2">
                <i className="bi bi-arrow-clockwise me-1"></i> 
                Refresh Data
              </button>
              <button onClick={logout} className="btn btn-outline-light">
                <i className="bi bi-box-arrow-right me-1"></i> 
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Error Display */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>System Alert:</strong> {error}
              <button onClick={refreshData} className="btn btn-sm btn-outline-danger ms-3">
                <i className="bi bi-arrow-clockwise me-1"></i> 
                Retry Connection
              </button>
            </div>
          )}

          {/* Auto-completion notification */}
          {stats.autoCompletedCount > 0 && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              <strong>Auto-Update:</strong> {stats.autoCompletedCount} past pending booking{stats.autoCompletedCount > 1 ? 's' : ''} automatically marked as completed.
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard Overview
            </button>
            <button 
              className={`tab-btn ${activeView === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveView('upcoming')}
            >
              <i className="bi bi-calendar-event me-2"></i>
              Upcoming Services ({stats.upcomingBookings || 0})
            </button>
            <button 
              className={`tab-btn ${activeView === 'predictions' ? 'active' : ''}`}
              onClick={() => setActiveView('predictions')}
            >
              <i className="bi bi-graph-up me-2"></i>
              Predictions & Analytics
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div className="dashboard-overview">
            {activeView === 'overview' && renderOverviewTab()}
            {activeView === 'upcoming' && renderUpcomingTab()}
            {activeView === 'predictions' && (
              <>
                <div className="section-header">
                  <h2>
                    <i className="bi bi-graph-up me-2"></i>
                    Business Predictions & Analytics
                  </h2>
                  <div className="prediction-status">
                    <span className="status-indicator active"></span>
                    Live Predictions
                  </div>
                </div>
                {renderPredictionCharts()}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Complete Enhanced Styles */}
      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .spinner-container {
          text-align: center;
        }

        .spinner-container h4 {
          margin-top: 1rem;
          font-weight: 600;
        }

        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2.5rem 0;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .admin-avatar {
          width: 70px;
          height: 70px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.3);
        }

        .admin-details h1 {
          margin: 0;
          font-size: 2.2rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-details p {
          margin: 0.5rem 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .admin-details small {
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .header-actions .btn {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .header-actions .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .dashboard-content {
          padding: 3rem 0;
        }

        .dashboard-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: rgba(255,255,255,0.9);
          border-radius: 15px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 1rem 2rem;
          color: #4a5568;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
          flex: 1;
          text-align: center;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .dashboard-overview {
          background: rgba(255,255,255,0.9);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2, .section-header h3 {
          margin: 0;
          color: #2d3748;
          font-weight: 700;
        }

        .auto-refresh-indicator, .upcoming-stats, .prediction-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .refresh-dot, .status-indicator {
          width: 8px;
          height: 8px;
          background: #48bb78;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .upcoming-count {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .stat-background {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          opacity: 0.1;
        }

        .users-card .stat-background {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
        }

        .bookings-card .stat-background {
          background: linear-gradient(45deg, #f093fb, #f5576c);
          color: white;
        }

        .services-card .stat-background {
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          color: white;
        }

        .revenue-card .stat-background {
          background: linear-gradient(45deg, #43e97b, #38f9d7);
          color: white;
        }

        .stat-content {
          position: relative;
          z-index: 2;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.25rem;
        }

        .stat-description {
          font-size: 0.9rem;
          color: #718096;
        }

        .stat-trend {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 1.5rem;
        }

        .status-metrics {
          margin-bottom: 3rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .status-item {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .status-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        .status-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
        }

        .status-item.pending .status-icon {
          background: linear-gradient(45deg, #ffd93d, #ff6b35);
        }

        .status-item.completed .status-icon {
          background: linear-gradient(45deg, #6bcf7f, #4d9de0);
        }

        .status-item.cancelled .status-icon {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        }

        .status-item.today .status-icon {
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
        }

        .status-item.upcoming .status-icon {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .status-details {
          flex: 1;
        }

        .status-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .status-label {
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .status-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .status-progress {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .pending-progress {
          background: linear-gradient(90deg, #ffd93d, #ff6b35);
        }

        .completed-progress {
          background: linear-gradient(90deg, #6bcf7f, #4d9de0);
        }

        .cancelled-progress {
          background: linear-gradient(90deg, #ff6b6b, #ee5a52);
        }

        .today-progress {
          background: linear-gradient(90deg, #4ecdc4, #44a08d);
        }

        .upcoming-progress {
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .recent-activity, .upcoming-services-view {
          margin-top: 2rem;
        }

        .activity-count {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .activity-content {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .bookings-table-container {
          overflow-x: auto;
        }

        .bookings-table {
          margin: 0;
          width: 100%;
        }

        .bookings-table thead th {
          background: #f8fafc;
          border: none;
          color: #4a5568;
          font-weight: 600;
          padding: 1.25rem 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .booking-row {
          transition: all 0.2s ease;
        }

        .booking-row:hover {
          background: #f7fafc;
          transform: scale(1.01);
        }

        .booking-row.upcoming-row {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.02), transparent);
        }

        .booking-row.past-row {
          background: linear-gradient(90deg, rgba(113, 128, 150, 0.02), transparent);
        }

        .booking-row.today-row {
          background: linear-gradient(90deg, rgba(76, 175, 80, 0.02), transparent);
        }

        .booking-row td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .booking-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: monospace;
          font-weight: 600;
          color: #4a5568;
          background: #f7fafc;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          display: inline-flex;
        }

        .customer-info {
          min-width: 150px;
        }

        .customer-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .customer-email {
          font-size: 0.9rem;
          color: #718096;
        }

        .service-name {
          font-weight: 500;
          color: #4a5568;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.completed {
          background: rgba(72, 187, 120, 0.1);
          color: #2f855a;
        }

        .status-badge.pending {
          background: rgba(255, 193, 7, 0.1);
          color: #d69e2e;
        }

        .status-badge.cancelled {
          background: rgba(245, 101, 101, 0.1);
          color: #c53030;
        }

        .status-badge.upcoming {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .status-badge.default {
          background: rgba(113, 128, 150, 0.1);
          color: #4a5568;
        }

        .booking-date {
          font-weight: 500;
          color: #4a5568;
        }

        .upcoming-date {
          color: #667eea;
          font-weight: 600;
        }

        .date-type {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .date-type.upcoming {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .date-type.today {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }

        .date-type.past {
          background: rgba(113, 128, 150, 0.1);
          color: #718096;
        }

        .days-until {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          text-align: center;
          font-size: 0.9rem;
        }

        .days-until.urgent {
          background: rgba(245, 101, 101, 0.1);
          color: #c53030;
        }

        .days-until.soon {
          background: rgba(255, 193, 7, 0.1);
          color: #d69e2e;
        }

        .days-until.week {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .days-until.later {
          background: rgba(113, 128, 150, 0.1);
          color: #718096;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-buttons .btn {
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .action-buttons .btn:hover {
          transform: translateY(-1px);
        }

        .no-activity {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
        }

        .no-activity-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-activity h5 {
          color: #4a5568;
          margin-bottom: 1rem;
        }

        /* Prediction Styles */
        .predictions-view {
          space-y: 2rem;
        }

        .prediction-summary {
          margin-bottom: 3rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        .summary-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .summary-card.growth .summary-icon {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        }

        .summary-card.confidence .summary-icon {
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
        }

        .summary-card.next-month .summary-icon {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .summary-card.revenue .summary-icon {
          background: linear-gradient(45deg, #43e97b, #38f9d7);
        }

        .summary-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: #2d3748;
        }

        .summary-content p {
          margin: 0;
          color: #4a5568;
          font-weight: 600;
        }

        .summary-content small {
          color: #718096;
          font-size: 0.8rem;
        }

        .chart-container, .weekly-predictions-container, .service-predictions-container {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .chart-header h3 {
          margin: 0;
          color: #2d3748;
          font-weight: 700;
        }

        .monthly-chart {
          display: flex;
          align-items: end;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 1rem;
          overflow-x: auto;
          min-height: 250px;
        }

        .chart-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
        }

        .bar-fill {
          width: 40px;
          border-radius: 4px 4px 0 0;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .chart-bar.actual .bar-fill {
          background: linear-gradient(180deg, #667eea, #764ba2);
        }

        .chart-bar.predicted .bar-fill {
          background: linear-gradient(180deg, #ff9a9e, #fecfef);
          border: 2px dashed #ff6b6b;
        }

        .bar-label {
          text-align: center;
          font-size: 0.8rem;
        }

        .bar-label strong {
          display: block;
          color: #2d3748;
          font-weight: 700;
        }

        .bar-label small {
          color: #718096;
        }

        .prediction-indicator {
          display: block;
          margin-top: 0.25rem;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-item.actual .legend-color {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .legend-item.predicted .legend-color {
          background: linear-gradient(45deg, #ff9a9e, #fecfef);
          border: 1px dashed #ff6b6b;
        }

        .weekly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .weekly-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 1.5rem;
          border-left: 4px solid #667eea;
        }

        .weekly-header h4 {
          margin: 0;
          color: #2d3748;
          font-weight: 700;
        }

        .weekly-header small {
          color: #718096;
        }

        .weekly-prediction {
          margin: 1rem 0;
          text-align: center;
        }

        .prediction-number {
          font-size: 2rem;
          font-weight: 800;
          color: #667eea;
        }

        .prediction-label {
          color: #4a5568;
          font-size: 0.9rem;
        }

        .confidence-bar {
          margin-top: 1rem;
        }

        .confidence-label {
          font-size: 0.8rem;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .confidence-progress {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #48bb78, #38f9d7);
          transition: width 0.8s ease;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .service-prediction-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .service-name {
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .demand-comparison {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .demand-item {
          text-align: center;
        }

        .demand-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #4a5568;
        }

        .demand-label {
          font-size: 0.8rem;
          color: #718096;
        }

        .demand-item.predicted .demand-number {
          color: #667eea;
        }

        .demand-arrow {
          color: #718096;
          font-size: 1.2rem;
        }

        .growth-indicator {
          color: #48bb78;
          font-size: 0.9rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .admin-info {
            flex-direction: column;
            text-align: center;
          }

          .dashboard-overview {
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .status-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .dashboard-tabs {
            flex-direction: column;
          }

          .tab-btn {
            padding: 0.75rem 1rem;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .monthly-chart {
            padding: 0.5rem;
          }

          .weekly-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .chart-legend {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
