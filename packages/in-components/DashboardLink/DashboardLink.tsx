/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';

interface Props {
  snapshotId: string;
  label: string;
  className: string;
}

export const DashboardLink = ({ snapshotId, label, className }: Props): JSX.Element => {
  const getDashboardLink = useGetDashboardLink();

  return (
    <Link href={getDashboardLink(snapshotId)} className={className}>
      {label}
    </Link>
  );
};
