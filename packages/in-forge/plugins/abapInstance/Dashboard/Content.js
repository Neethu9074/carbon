/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useAbapInstanceDashboard, useAbapCentralInstanceDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  const data = snapshot.get('data');
  const hrefCentral = useAbapCentralInstanceDashboard(snapshot.get('id'));
  const href = useAbapInstanceDashboard(snapshot.get('id'));
  if (data.get('name').includes('Central')) {
    return <RedirectWithHash href={hrefCentral} />;
  } else {
    return <RedirectWithHash href={href} />;
  }
}
