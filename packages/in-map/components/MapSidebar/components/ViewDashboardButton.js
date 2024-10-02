/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

import './ViewDashboardButton.less';

const block = carbonButtonEnabled ? '' : 'in-sidebar-view-dashboard';

export default function ViewDashboardButton({ snapshotId }) {
  const getDashboardLink = useGetDashboardLink();

  return (
    <Button
      size={carbonButtonEnabled ? 'compact' : 'normal'}
      kind={carbonButtonEnabled ? 'tertiary' : 'primary'}
      href={getDashboardLink(snapshotId)}
      className={block}
    >
      {t('in-map:openDashboard')}
    </Button>
  );
}
