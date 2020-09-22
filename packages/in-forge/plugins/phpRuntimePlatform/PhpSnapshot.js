import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getProcessCompanions } from 'in-stores/snapshot/graph';
import Info from 'in-forge/plugins/phpRuntimePlatform/Info';
import useObservable from 'in-hooks/useObservable';
import { getSnapshot } from 'in-stores/snapshot';

export default function PhpSnapshot({ snapshotId, initiallyOpen }) {
  const companions = useObservable(
    getProcessCompanions(snapshotId)
      .flatMap(companionIds => {
        const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
        return combineLatest(companions$, false);
      })
      .map(companions =>
        companions.filter(
          m =>
            !!m &&
            // PHP companions may sometimes exist, but don't have any associated data.
            // Until this is properly fixed, we add this additional filter
            m.getIn(['data', 'version'])
        )
      ),
    [snapshotId]
  );

  if (!companions || companions.length === 0) {
    return null;
  }

  return (
    <>
      {companions.map(companion => (
        <Info key={companion.get('id')} snapshot={companion} initiallyOpen={initiallyOpen} />
      ))}
    </>
  );
}
