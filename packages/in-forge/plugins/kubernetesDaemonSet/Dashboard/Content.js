/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getDaemonSetDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesDaemonSetDashboard({ snapshot }) {
  return <RedirectWithHash to$={getDaemonSetDashboard(snapshot.get('id'))} />;
}
