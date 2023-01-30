/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getIbmpLparDashboard } from 'in-phmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function PhmcLparDashboard({ snapshot, timeConfig }) {
  return <RedirectWithHash to$={getIbmpLparDashboard(snapshot.get('id'), { timeConfig })} />;
}
