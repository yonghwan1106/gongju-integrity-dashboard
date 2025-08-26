import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';

const NotificationSystem = ({ data, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    generateNotifications();
  }, [data]);

  const generateNotifications = () => {
    const newNotifications = [];
    const now = new Date();

    // 부서별 성과 알림
    data.departments?.forEach(dept => {
      const trendNum = parseFloat(dept.trend);
      
      if (trendNum > 2) {
        newNotifications.push({
          id: `trend-up-${dept.id}`,
          type: 'success',
          title: '우수 성과 부서',
          message: `${dept.name}이(가) ${dept.trend}점 상승하여 ${dept.score}점을 기록했습니다.`,
          timestamp: now,
          department: dept.name,
          isRead: false
        });
      } else if (trendNum < -1) {
        newNotifications.push({
          id: `trend-down-${dept.id}`,
          type: 'warning',
          title: '개선 필요 알림',
          message: `${dept.name}의 청렴지수가 ${dept.trend}점 하락했습니다. 점검이 필요합니다.`,
          timestamp: now,
          department: dept.name,
          isRead: false
        });
      }

      if (dept.score < 70) {
        newNotifications.push({
          id: `low-score-${dept.id}`,
          type: 'error',
          title: '임계점 알림',
          message: `${dept.name}의 청렴지수(${dept.score}점)가 임계점 이하입니다.`,
          timestamp: now,
          department: dept.name,
          isRead: false
        });
      }
    });

    // 전체 지수 알림
    if (data.integrationIndex?.totalScore > 80) {
      newNotifications.push({
        id: 'overall-excellent',
        type: 'success',
        title: '전체 청렴지수 우수',
        message: `전체 청렴지수가 ${data.integrationIndex.totalScore}점으로 우수한 수준을 유지하고 있습니다.`,
        timestamp: now,
        isRead: false
      });
    }

    // 시민 만족도 알림
    if (data.integrationIndex?.citizenSatisfaction > 75) {
      newNotifications.push({
        id: 'citizen-satisfaction',
        type: 'info',
        title: '시민 만족도 양호',
        message: `시민 만족도가 ${data.integrationIndex.citizenSatisfaction}점으로 양호한 수준입니다.`,
        timestamp: now,
        isRead: false
      });
    }

    // 중복 제거 및 최신 5개만 유지
    const uniqueNotifications = newNotifications
      .filter((notif, index, arr) => 
        arr.findIndex(n => n.id === notif.id) === index
      )
      .slice(0, 5);

    setNotifications(uniqueNotifications);
    setUnreadCount(uniqueNotifications.filter(n => !n.isRead).length);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    if (onNotificationRead) {
      onNotificationRead(notificationId);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setUnreadCount(prev => {
      const removedNotif = notifications.find(n => n.id === notificationId);
      return removedNotif && !removedNotif.isRead ? Math.max(0, prev - 1) : prev;
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="알림"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              알림 ({unreadCount}개 읽지 않음)
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary-dark"
                >
                  모두 읽음
                </button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                새로운 알림이 없습니다
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 border-l-4 ${getNotificationBorderColor(notification.type)} ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        {notification.department && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded-full text-gray-600 dark:text-gray-300">
                            {notification.department}
                          </span>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {notification.timestamp.toLocaleTimeString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                          title="읽음 처리"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                        title="삭제"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;