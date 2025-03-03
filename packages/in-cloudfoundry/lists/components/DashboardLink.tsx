/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { CloudfoundryApplicationListItem } from '@instana/types/typeDefinitions';

import { useNavigateToApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import EntityLink from 'in-components/EntityLink';

export function DashboardLink({ item }: { item: CloudfoundryApplicationListItem }) {
  const getApplicationDashboardLink = useNavigateToApplicationDashboard();

  return (
    <EntityLink label={item.label} href={getApplicationDashboardLink(item.id)} icon="lib_cloudfoundry_application" />
  );
}
