/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getSapHanaSystemDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  return <RedirectWithHash to$={getSapHanaSystemDashboard(snapshot.get('id'))} />;
}
