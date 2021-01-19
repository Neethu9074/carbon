/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function OpenshiftDeploymentConfigDashboard({ snapshot, timeConfig }) {
  return <RedirectWithHash to$={getDeploymentConfigDashboard(snapshot.get('id'), { timeConfig })} />;
}
