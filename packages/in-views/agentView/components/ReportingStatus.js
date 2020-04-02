import React from 'react';

export const reportingStatus = {
  ONLINE: {
    value: 0,
    Component: function onlineStatus() {
      return `reporting`;
    }
  },
  DEGRADED: {
    value: 1,
    Component: function degradedStatus({ count }) {
      return (
        <span>
          {count} issue
          {count > 1 ? 's' : ''}
        </span>
      );
    }
  },
  OFFLINE: {
    value: 2,
    Component: function offlineStatus() {
      return `not reporting`;
    }
  }
};
