import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';

export default function DashboardButtonLine({ snapshotId, timeConfig, tagFilters, plugin, showContextGuide }) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
      {showContextGuide && (
        <ContextGuide id={snapshotId} plugin={plugin} timeConfig={timeConfig} tagFilters={tagFilters} />
      )}
    </>
  );
}
