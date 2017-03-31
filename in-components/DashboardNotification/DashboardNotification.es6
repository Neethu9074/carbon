import React from 'react';

import './DashboardNotification.less';

const block = 'in-dashboard-nofitication';

export default function DashboardNotification({ children, type }) {
  return (
    <p className={`${block} ${block}__${type}`}>
      {children}
    </p>
  );
}
