import {combineLatest} from 'reactive-observables';
import React from 'react';

import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import CountersTable from 'in-sdk/components/dashboard/CustomMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/CustomMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/CustomMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/CustomMetrics/TimersTable';
import HistogramsTable from 'in-sdk/components/dashboard/CustomMetrics/HistogramsTable';

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
}, function CompanionMetrics({companions, timeframe}) {
  if (!companions || companions.length === 0) {
    return null;
  }

  return (
    <div>
      {companions.map(companion =>
        <div title={companion.getIn(['data', 'kind'])}>
          <GaugesTable snapshot={companion} timeframe={timeframe} />
          <CountersTable snapshot={companion} timeframe={timeframe} />
          <MetersTable snapshot={companion} timeframe={timeframe} />
          <TimersTable snapshot={companion} timeframe={timeframe} />
          <HistogramsTable snapshot={companion} timeframe={timeframe} />
        </div>
      )}
    </div>
  );
});
