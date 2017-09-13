import React from 'react';

import './NotificationSeverity.less';

const block = 'in-agent-view-notifications-table-severity';

export default function NotificationSeverity({ severity }) {
  const config = getConfig(severity);
  return (
    <div
      className={block}
      style={{
        background: config.background
      }}
    >
      <span
        style={{
          color: config.color
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

function getConfig(severity) {
  if (severity > 5) {
    return { background: '#e74c3c', color: '#eef2f4', label: 'Critical' };
  } else if (severity > 0) {
    return { background: '#f1c40f', color: '#eef2f4', label: 'Warning' };
  }
  return { background: '#eef2f4', color: '#4d4d4d', label: 'Info' };
}
