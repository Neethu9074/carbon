/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesPodDashboard({ snapshot }) {
  return <RedirectWithHash to$={getPodDashboard(snapshot.get('id'))} />;
}
