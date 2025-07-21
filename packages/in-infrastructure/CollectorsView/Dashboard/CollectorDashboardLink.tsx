/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link } from '@instana/components';

import { Collector } from 'in-plg/pages/Datasource/OTelCollector/OTelCollector';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';

interface Props {
  collector: Collector;
}

export default function CollectorDashboardLink({ collector }: Props) {
  const { label, snapshotId } = collector;

  const href = useGetDashboardLink()(snapshotId);

  return <Link href={href}>{label}</Link>;
}
