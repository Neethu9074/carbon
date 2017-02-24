import {combineLatest} from 'reactive-observables';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    companions: props.companions$
      .flatMap(companionIds => {
        const companions$ = companionIds.toArray().map(snapshotId => {
          return getSnapshot(snapshotId)
           .startWith(null);
        });
        return combineLatest(companions$);
      })
      .map(companions => companions.filter(m => !!m))
  };
}, function CompanionMetrics({companions}) {
  if (!companions || companions.length === 0) {
    return null;
  }

  return (
    <div>
      {companions.map(companion =>
        <DashboardSection title={companion.getIn(['data', 'kind'])}>
          Put companion data here
        </DashboardSection>
      )}
    </div>
  );
});
