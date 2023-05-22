/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import InstanceDashboard from './instance/InstanceContent';
import RacDashboard from './rac/RacContent';

export default function OracleDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const data = snapshot.get('data');
  if (data.get('enableRacMonitoring')) {
    return <RacDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  }
  return <InstanceDashboard snapshot={snapshot} timeConfig={timeConfig} />;
}
