import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function UnknownServiceDashboard() {
  return (
    <DashboardNotification type="info">
      There is no further information about this entity.
    </DashboardNotification>
  );
}
