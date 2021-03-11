/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { compose } from 'recompose';
import React from 'react';

import GraphExplorerMap from 'in-internal/thisUnit/GraphExplorer/GraphExplorerMap';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import withUrlState from 'in-hoc/withUrlState';
import getGraph from 'in-subscription/graph';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './GraphExplorer.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/graphExplorer',
        name: 'snapshotId',
        as: 'snapshotId',
        initialState: ''
      }
    ],
    reducerName: 'setSnapshotId',
    replaceHistory: false
  }),
  connectTo(({ snapshotId }) => ({
    connected: combineLatest([
      getSnapshot(snapshotId)
        .filter(Boolean)
        .distinct(),
      timeConfig$.flatMap(getGraph).throttle(60 * 1000)
    ]).map(([snapshot, graph]) => ({
      selectedSnapshotId: snapshot.get('id'),
      ...getConnectedEntities(snapshot.get('id'), graph)
    }))
  }))
)(GraphExplorer);

function GraphExplorer({ snapshotId, setSnapshotId, connected }) {
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

function getConnectedEntities(snapshotId, graph) {
  const incoming = [];
  const outgoing = [];

  for (let i = 0; i < graph.length; i++) {
    const item = graph[i];
    if (item.from === snapshotId) {
      outgoing.push({ id: item.to, relation: item.relation });
    } else if (item.to === snapshotId) {
      incoming.push({ id: item.from, relation: item.relation });
    }
  }

  return { incoming, outgoing };
}
