/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import GraphExplorerMap from 'in-internal/thisUnit/GraphExplorer/GraphExplorerMap';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import useUrlState from 'in-hooks/useUrlState';
import getGraph from 'in-subscription/graph';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './GraphExplorer.mless';

export default function GraphExplorer() {
  const urlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: '/graphExplorer',
        name: 'snapshotId',
        as: 'snapshotId',
        initialState: ''
      }
    ]
  };

  const [{ snapshotId }, setSnapshotId] = useUrlState(urlStateConfig);
  const connected = useObservable(
    combineLatest([
      getSnapshot(snapshotId).filter(Boolean).distinct(),
      timeConfig$
        .map(timeConfig => ({ snapshotId, timeConfig }))
        .flatMap(getGraph)
        .throttle(60 * 1000)
    ]).map(([snapshot, graph]) => ({
      selectedSnapshotId: snapshot.get('id'),
      ...getConnectedEntities(snapshot.get('id'), graph)
    })),
    [snapshotId]
  );

  return (
    <div className={locals.view}>
      <Input
        className={locals.input}
        type="text"
        id="snapshotId-value"
        placeholder={t('in-internal:thisUnit.graphExplorer.snapshotId')}
        value={snapshotId}
        onChange={e => setSnapshotId({ snapshotId: e.target.value })}
        autoFocus
      />
      {connected && <GraphExplorerMap connected={connected} onClick={id => setSnapshotId({ snapshotId: id })} />}
    </div>
  );
}

function getConnectedEntities(snapshotId, { edges }) {
  const incoming = [];
  const outgoing = [];

  for (let i = 0; i < edges.length; i++) {
    const item = edges[i];
    if (item.from === snapshotId) {
      outgoing.push({ id: item.to, relation: item.relation });
    } else if (item.to === snapshotId) {
      incoming.push({ id: item.from, relation: item.relation });
    }
  }

  return { incoming, outgoing };
}
