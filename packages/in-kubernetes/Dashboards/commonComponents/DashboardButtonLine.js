import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import StackButton from 'in-new-components/Stack/StackButton';

export default function DashboardButtonLine({ snapshotId, timeConfig }) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
      <StackButton id={snapshotId} timeConfig={timeConfig} />
    </>
  );
}
