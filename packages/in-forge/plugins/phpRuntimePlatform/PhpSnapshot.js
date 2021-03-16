/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { getProcessCompanions } from 'in-stores/snapshot/graph';
import Info from 'in-forge/plugins/phpRuntimePlatform/Info';
import useObservable from 'in-hooks/useObservable';
import { getSnapshot } from 'in-stores/snapshot';

export default function PhpSnapshot({ snapshotId, initiallyOpen }) {
  const companions = useObservable(getCompanions, [snapshotId]);
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

function getCompanions([snapshotId]) {
  return getProcessCompanions(snapshotId)
    .flatMap(companionIds => {
      const companions$ = companionIds.toArray().map(snapshotId => getSnapshot(snapshotId));
      return combineLatest(companions$, false);
    })
    .map(companions =>
      companions.filter(
        snapshot =>
          !!snapshot &&
          // PHP companions may sometimes exist, but don't have any associated data.
          // Until this is properly fixed, we add this additional filter
          snapshot.getIn(['data', 'version'])
      )
    );
}
