/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import BatchAppContent from './BatchAppContent';
import StreamingAppContent from './StreamingAppContent';

export default function Dashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const streamingApp = snapshot.getIn(['data', 'streamingApp'], false);
  if (streamingApp) {
    return <StreamingAppContent snapshot={snapshot} timeConfig={timeConfig} />;
  } else {
    return <BatchAppContent snapshot={snapshot} timeConfig={timeConfig} />;
  }
}
