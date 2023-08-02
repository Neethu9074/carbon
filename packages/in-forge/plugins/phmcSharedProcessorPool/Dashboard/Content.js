/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useIbmpSppDashboard } from 'in-phmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function PhmcSharedProcessorPoolDashboard({ snapshot, timeConfig }) {
  const getIbmpSppDashboard = useIbmpSppDashboard();

  return <RedirectWithHash to={getIbmpSppDashboard(snapshot.get('id'), { timeConfig })} />;
}
