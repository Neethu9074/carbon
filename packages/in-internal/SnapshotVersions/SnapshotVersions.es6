import { compose, withState } from 'recompose';
import diff from 'deep-diff';
import React from 'react';

import createSnapshotVersionsInTimeframeObservable from 'in-subscription/snapshotVersionsInTimeframe';
import SnapshotTimeline from 'in-internal/SnapshotVersions/SnapshotTimeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';

import locals from './SnapshotVersions.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/snapshotVersions',
        name: 'snapshotId',
        as: 'snapshotId',
        initialState: ''
      }
    ],
    reducerName: 'setSnapshotId',
    replaceHistory: false
  }),
  withState('signal', 'setSignal', false),
  connectTo(({ snapshotId, signal }) => ({
    snapshotVersionsResponse: timeConfig$
      .debounce(100)
      .flatMap(timeConfig => {
        if (!signal || !snapshotId) {
          return alwaysNull;
        }
        return createSnapshotVersionsInTimeframeObservable({ snapshotId, timeConfig })
          .map(enrichDiffs)
          .map(_snapshotVersions => ({
            timeConfig: { ...timeConfig, to: timeConfig.to || Date.now() },
            snapshotVersions: _snapshotVersions
          }));
      })
      .filter(res => res && res.snapshotVersions)
  }))
)(SnapshotVersions);

function SnapshotVersions({ snapshotId, setSnapshotId, setSignal, snapshotVersionsResponse }) {
  return (
    <div className={locals.view}>
      <div className={locals.header}>
        <Input
          className={locals.input}
          type="text"
          id="snapshotId-value"
          placeholder="snapshotId..."
          value={snapshotId}
          onChange={e => {
            setSignal(false);
            setSnapshotId({ snapshotId: e.target.value });
          }}
          autoFocus
        />
        <Button onClick={() => setSignal(true)}>Refresh</Button>
      </div>

      <div className={locals.content}>
        {snapshotVersionsResponse && (
          <SnapshotTimeline
            snapshots={snapshotVersionsResponse.snapshotVersions}
            timeConfig={snapshotVersionsResponse.timeConfig}
          />
        )}
      </div>
    </div>
  );
}

function enrichDiffs(snapshots) {
  if (!snapshots || snapshots.length <= 1) {
    return snapshots;
  }

  snapshots.sort((s1, s2) => s1.from - s2.from);

  const differences = [];
  for (let i = 1; i < snapshots.length; i++) {
    differences[i] = difference(snapshots[i - 1], snapshots[i]);
  }

  for (let i = 0; i < differences.length; i++) {
    snapshots[i].__difference = differences[i];
  }
  return snapshots;
}

function difference(lhs, rhs) {
  const mask = ['timestamp', 'from', 'to'];
  return diff(lhs, rhs, (path, key) => path.length === 0 && ~mask.indexOf(key));
}
