/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesDeploymentDashboard({ snapshot }) {
  return <RedirectWithHash to$={getDeploymentDashboard(snapshot.get('id'))} />;
}
