import React from 'react';

import './DashboardNotification.less';

const block = 'in-dashboard-nofitication';

export default function DashboardNotification({ children, type }) {
  return <div className={`${block} ${block}__${type}`}>{children}</div>;
}
