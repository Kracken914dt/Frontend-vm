import React from 'react';

const ActivityItem = ({ time, title, description, user, userInitials }) => {
  return (
    <div className="flex items-start pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
          {userInitials}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="mt-1 flex items-center">
          <span className="text-xs text-gray-500">{time} • {user}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
