/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getStatefulSetDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesStatefulSetDashboard({ snapshot }) {
  return <RedirectWithHash to$={getStatefulSetDashboard(snapshot.get('id'))} />;
}
