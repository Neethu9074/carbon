/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getAbapCentralInstanceDashboard } from 'in-sap/navigation/paths';
import { getAbapInstanceDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  const data = snapshot.get('data');
  if (data.get('name').includes('Central')) {
    return <RedirectWithHash to$={getAbapCentralInstanceDashboard(snapshot.get('id'))} />;
  } else {
    return <RedirectWithHash to$={getAbapInstanceDashboard(snapshot.get('id'))} />;
  }
}
