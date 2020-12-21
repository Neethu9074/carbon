import { combineLatest } from '@instana/observables';
import React, { Fragment } from 'react';

import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      companions: props.companions$
        .flatMap(companionIds => {
          const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
          return combineLatest(companions$, false);
        })
        .map(companions => companions.filter(Boolean))
    };
  },
  function CompanionMetrics({ companions, timeConfig }) {
    if (!companions) {
      return null;
    }

    return (
      <Fragment>
        {companions.map(companion => (
          <CustomMetricsV2 key={companion.get('id')} snapshot={companion} timeConfig={timeConfig} />
        ))}
      </Fragment>
    );
  }
);
