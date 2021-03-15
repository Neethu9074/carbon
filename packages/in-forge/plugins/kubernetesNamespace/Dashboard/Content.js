/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesNamespaceDashboard({ snapshot }) {
  return <RedirectWithHash to$={getNamespaceDashboard(snapshot.get('id'))} />;
}
