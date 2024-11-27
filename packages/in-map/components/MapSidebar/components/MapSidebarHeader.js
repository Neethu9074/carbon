/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import ViewDashboardButton from 'in-map/components/MapSidebar/components/ViewDashboardButton';
import SidebarHeader from 'in-map/components/MapSidebar/components/SidebarHeader';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';

import locals from './MapSidebarHeader.mless';

export default function MapSidebarHeader({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div className={locals.sidebarHeader}>
      <SidebarHeader snapshot={snapshot} />
      <Stack direction="horizontal" gap="xsmall" wrap>
        <ViewDashboardButton snapshotId={snapshotId} />
        <EntityHealthIndicator
          IndicatorPresenter={HealthIndicatorButtonPresenter}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
        />
      </Stack>
    </div>
  );
}
