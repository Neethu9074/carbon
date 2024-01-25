/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  const getPowervcRegionDashboard = usePowervcRegionDashboard();

  return <RedirectWithHash to={getPowervcRegionDashboard(snapshot.get('id'))} />;
}
