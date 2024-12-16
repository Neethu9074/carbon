/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useSapDbTenantDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SapDbTenantDashboard({ snapshot }) {
  const href = useSapDbTenantDashboard(snapshot.get('id'));
  return <RedirectWithHash href={href} />;
}
