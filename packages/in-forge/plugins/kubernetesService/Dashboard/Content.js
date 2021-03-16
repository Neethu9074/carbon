/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesServiceDashboard({ snapshot }) {
  return <RedirectWithHash to$={getServiceDashboard(snapshot.get('id'))} />;
}
