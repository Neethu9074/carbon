import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import LogLines from 'in-views/logView/LogLines';
import Title from 'in-components/Title';

export default function LogView() {
  return (
    <div>
      <Title title="Logs" />
      <LogLines />
      {DashboardNavigationRoute}
    </div>
  );
}
