/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';

export const DashboardLink = ({ snapshotId, label, className }) => {
  const getDashboardLink = useGetDashboardLink();

  return (
    <Link href={getDashboardLink(snapshotId)} className={className}>
      {label}
    </Link>
  );
};
