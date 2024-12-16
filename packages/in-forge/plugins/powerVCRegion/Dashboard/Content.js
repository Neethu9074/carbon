/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';

export default function SystemDashboard({ snapshot, timeConfig }) {
  const getPowervcRegionDashboard = usePowervcRegionDashboard();
  const href = getPowervcRegionDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
