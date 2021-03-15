/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesNodeDashboard({ snapshot }) {
  return <RedirectWithHash to$={getNodeDashboard(snapshot.get('id'))} />;
}
