/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesNodeDashboard({ snapshot }) {
  return <RedirectWithHash to$={getNodeDashboard(snapshot.get('id'))} />;
}
