/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function ViewDashboardButton({ snapshotId }) {
  const getDashboardLink = useGetDashboardLink();

  return (
    <Button size="compact" kind="tertiary" href={getDashboardLink(snapshotId)}>
      {t('in-map:openDashboard')}
    </Button>
  );
}
