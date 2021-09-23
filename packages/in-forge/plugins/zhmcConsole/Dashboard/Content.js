/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIbmzCpcDashboard } from 'in-zhmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  return <RedirectWithHash to$={getIbmzCpcDashboard(snapshot.get('id'))} />;
}
