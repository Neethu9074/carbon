/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import EntityHealthIndicatorComponent from 'in-new-components/EntityHealthIndicator';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/time/config';
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
