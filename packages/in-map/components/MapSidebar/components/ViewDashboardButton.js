/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/legacy';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

import './ViewDashboardButton.less';

const block = 'in-sidebar-view-dashboard';

export default function ViewDashboardButton({ snapshotId }) {
  const getDashboardLink = useGetDashboardLink();

  return (
    <Button href={getDashboardLink(snapshotId)} className={block}>
      {t('in-map:openDashboard')}
    </Button>
  );
}
