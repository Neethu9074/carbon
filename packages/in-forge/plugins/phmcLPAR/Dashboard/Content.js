/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Redirect } from 'react-router-dom';
import React from 'react';

import { useIbmpLparDashboard } from 'in-phmc/navigation/paths';

export default function PhmcLparDashboard({ snapshot, timeConfig }) {
  const getIbmpLparDashboard = useIbmpLparDashboard();
  const href = getIbmpLparDashboard(snapshot.get('id'), { timeConfig });

  return <Redirect to={href.substring(2)} />;
}
