/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { InfrastructureExploreItem } from '@instana/types';
import { Link } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';

export default function CollectorDashboardLink(collector: InfrastructureExploreItem) {
  const { label, snapshotId } = collector;

  const href = useGetDashboardLink()(snapshotId || '');

  return <Link href={href}>{label}</Link>;
}
