import React from 'react';

import * as EntityHealthIndicatorComponent from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const observables = {
      timeConfig: timeConfig$
    };
    if (!props.healthInfo) {
      observables.healthInfo = getHealthInfoAtFocusedMoment(props.snapshotId);
    }
    return observables;
  },
  function EntityHealthIndicator({ healthInfo, snapshotId, timeConfig }) {
    if (!healthInfo) {
      return null;
    }

    return (
      <EntityHealthIndicatorComponent
        openIssues={healthInfo.get('numberOfOpenEvents')}
        maxSeverity={healthInfo.get('maxSeverity')}
        IndicatorPresenter={HealthIndicatorPresenter}
        timeConfig={timeConfig}
        snapshotId={snapshotId}
      />
    );
  }
);
