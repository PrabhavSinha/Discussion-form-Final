import { useEffect } from 'react';
import { useForum } from '../../context/ForumContext.jsx';

function Toast({ notification }) {
  const { dismissNotification } = useForum();

  useEffect(() => {
    const timer = setTimeout(() => dismissNotification(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, dismissNotification]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const styles = {
    success: 'bg-sage-500 text-white',
    error: 'bg-rust-500 text-white',
    info: 'bg-ink-700 text-white dark:bg-parchment-100 dark:text-ink-900',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-up ${styles[notification.type || 'info']}`}
    >
      <span className="font-bold text-sm" aria-hidden="true">
        {icons[notification.type || 'info']}
      </span>
      <span className="text-sm font-medium">{notification.message}</span>
      <button
        onClick={() => dismissNotification(notification.id)}
        className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export default function NotificationContainer() {
  const { notifications } = useForum();

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-label="Notifications"
    >
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  );
}
