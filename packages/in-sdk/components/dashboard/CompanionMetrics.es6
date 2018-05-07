import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import HistogramsTable from 'in-sdk/components/dashboard/customMetrics/HistogramsTable';
import CountersTable from 'in-sdk/components/dashboard/customMetrics/CountersTable';
import GaugesTable from 'in-sdk/components/dashboard/customMetrics/GaugesTable';
import MetersTable from 'in-sdk/components/dashboard/customMetrics/MetersTable';
import TimersTable from 'in-sdk/components/dashboard/customMetrics/TimersTable';

export default connectTo(
  props => {
    return {
      companions: props.companions$
        .flatMap(companionIds => {
          const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
          return combineLatest(companions$, false);
        })
        .map(companions => companions.filter(m => !!m))
    };
  },
  function CompanionMetrics({ companions, timeConfig }) {
    if (!companions || companions.length === 0) {
      return null;
    }

    return (
      <div>
        {companions.map(companion => (
          <div key={companion.get('id')}>
            <GaugesTable snapshot={companion} timeConfig={timeConfig} />
            <CountersTable snapshot={companion} timeConfig={timeConfig} />
            <MetersTable snapshot={companion} timeConfig={timeConfig} />
            <TimersTable snapshot={companion} timeConfig={timeConfig} />
            <HistogramsTable snapshot={companion} timeConfig={timeConfig} />
          </div>
        ))}
      </div>
    );
  }
);
