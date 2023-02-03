/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { getOpenstackInstanceDashboard } from 'in-openstack/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function Dashboard({ snapshot, timeConfig }) {
  return <RedirectWithHash to$={getOpenstackInstanceDashboard(snapshot.get('id'), { timeConfig })} />;
}
