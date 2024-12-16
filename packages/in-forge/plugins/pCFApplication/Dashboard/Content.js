/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { pcfEnabled } from 'in-services/featureFlags';

export default function PCFApplicationDashboard({ snapshot }) {
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();

  if (pcfEnabled) {
    const snapshotId = snapshot.get('id');
    return <RedirectWithHash to={getApplicationDashboardLink(snapshotId)} />;
  }
  return <div />;
}
