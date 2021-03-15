/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getClusterDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesClusterDashboard({ snapshot }) {
  return <RedirectWithHash to$={getClusterDashboard(snapshot.get('id'))} />;
}
