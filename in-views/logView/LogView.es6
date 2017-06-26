import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import LogLines from 'in-views/logView/LogLines';

export default function LogView() {
  return (
    <div>
      <LogLines />
      <DashboardNavigationRoute />
    </div>
  );
}
