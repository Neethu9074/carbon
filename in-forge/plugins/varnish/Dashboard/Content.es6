import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function VarnishDashboard({snapshot}) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }

  return (
    <div>

    </div>
  );
}
