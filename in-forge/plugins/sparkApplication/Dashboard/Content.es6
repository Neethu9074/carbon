import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import BatchAppContent from './BatchAppContent';
import StreamingAppContent from './StreamingAppContent';

export default function Dashboard({ snapshot, timeframe }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }
  const streamingApp = snapshot.getIn(['data', 'streamingApp'], false);
  if (streamingApp) {
    return <StreamingAppContent snapshot={snapshot} timeframe={timeframe} />;
  } else {
    return <BatchAppContent snapshot={snapshot} timeframe={timeframe} />;
  }
}
