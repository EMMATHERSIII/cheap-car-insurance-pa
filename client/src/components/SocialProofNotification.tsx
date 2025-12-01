import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface Notification {
  id: number;
  city: string;
  timeAgo: string;
  visible: boolean;
}

const PA_CITIES = [
  "Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading",
  "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "York",
  "Altoona", "Wilkes-Barre", "Chester", "Williamsport", "Easton"
];

const TIME_RANGES = [
  "2 minutes ago", "5 minutes ago", "8 minutes ago", "12 minutes ago",
  "15 minutes ago", "20 minutes ago", "25 minutes ago", "30 minutes ago"
];

export function SocialProofNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if user dismissed it
    if (dismissed) return;

    // Show first notification after 5 seconds
    const initialDelay = setTimeout(() => {
      showRandomNotification();
    }, 5000);

    // Show new notification every 15-25 seconds
    const interval = setInterval(() => {
      if (!dismissed) {
        showRandomNotification();
      }
    }, Math.random() * 10000 + 15000); // Random between 15-25 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [dismissed]);

  const showRandomNotification = () => {
    const city = PA_CITIES[Math.floor(Math.random() * PA_CITIES.length)];
    const timeAgo = TIME_RANGES[Math.floor(Math.random() * TIME_RANGES.length)];
    
    const newNotification: Notification = {
      id: Date.now(),
      city,
      timeAgo,
      visible: true
    };

    setNotification(newNotification);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, visible: false } : null);
    }, 8000);
  };

  const handleDismiss = () => {
    setNotification(prev => prev ? { ...prev, visible: false } : null);
    setDismissed(true);
  };

  if (!notification || !notification.visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-500"
      style={{
        animation: notification.visible 
          ? "slideInUp 0.5s ease-out" 
          : "slideOutDown 0.5s ease-in"
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 pr-12 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Someone from {notification.city}
            </p>
            <p className="text-sm text-gray-600">
              just received their insurance quote
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {notification.timeAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
