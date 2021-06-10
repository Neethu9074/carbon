/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import ViewDashboardButton from 'in-map/components/MapSidebar/components/ViewDashboardButton';
import SidebarHeader from 'in-map/components/MapSidebar/components/SidebarHeader';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';

import locals from './MapSidebarHeader.mless';

export default function MapSidebarHeader({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div className={locals.sidebarHeader}>
      <SidebarHeader snapshot={snapshot} />
      <div className={locals.buttonContainer}>
        <ViewDashboardButton snapshotId={snapshotId} />
        <EntityHealthIndicator
          IndicatorPresenter={HealthIndicatorButtonPresenter}
          snapshotId={snapshotId}
          timeConfig={timeConfig}
        />
      </div>
    </div>
  );
}
