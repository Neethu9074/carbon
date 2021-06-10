/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';

export default function DashboardButtonLine({ snapshotId, timeConfig, tagFilters, plugin }) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
      <ContextGuide id={snapshotId} plugin={plugin} timeConfig={timeConfig} tagFilters={tagFilters} />
    </>
  );
}
