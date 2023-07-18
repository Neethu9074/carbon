/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function Dashboard({ snapshot, timeConfig }) {
  const getOpenstackRegionDashboard = useOpenstackRegionDashboard();

  return <RedirectWithHash to={getOpenstackRegionDashboard(snapshot.get('id'), { timeConfig })} />;
}
