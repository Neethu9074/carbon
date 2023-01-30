/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function PhmcSystemDashboard({ snapshot, timeConfig }) {
  return <RedirectWithHash to$={getIbmpSystemDashboard(snapshot.get('id'), { timeConfig })} />;
}
