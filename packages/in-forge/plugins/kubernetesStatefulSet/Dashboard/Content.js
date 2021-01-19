/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getStatefulSetDashboard } from 'in-kubernetes/navigation/paths';

export default function KubernetesStatefulSetDashboard({ snapshot }) {
  return <RedirectWithHash to$={getStatefulSetDashboard(snapshot.get('id'))} />;
}
