/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useSapAbapSystemSensorDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  const href = useSapAbapSystemSensorDashboard(snapshot.get('id'));
  return <RedirectWithHash href={href} />;
}
