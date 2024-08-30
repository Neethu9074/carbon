/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getAgentSnapshotId from 'in-subscription/getAgentSnapshotId';
import { playwithEnabled } from 'in-services/featureFlags';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id')),
      snapshotId: getAgentSnapshotId(props.snapshot)
    };
  },
  function EnableSelfMonitoringButton({ isOnline, snapshotId }) {
    const href = useGetDashboardLink()(snapshotId);

    const button = (
      <Button kind="primary" disabled={!isOnline || playwithEnabled} href={href}>
        {t('in-forge:plugins.host.dashboard.openAgentManagement')}
      </Button>
    );

    if (isOnline || !href) {
      return button;
    }

    return (
      <Tooltip content={t('in-forge:plugins.host.dashboard.agentManagementIsOnlyAvailableWhenTheAgentIsRunning')}>
        {button}
      </Tooltip>
    );
  }
);
