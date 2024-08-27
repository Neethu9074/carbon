/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useSapDbmsDashboard } from 'in-sap/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SapDbmsDashboard({ snapshot }) {
  const href = useSapDbmsDashboard(snapshot.get('id'));
  return <RedirectWithHash href={href} />;
}
