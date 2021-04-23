/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getCronJobDashboard } from 'in-kubernetes/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function KubernetesCronJobDashboard({ snapshot }) {
  return <RedirectWithHash to$={getCronJobDashboard(snapshot.get('id'))} />;
}
