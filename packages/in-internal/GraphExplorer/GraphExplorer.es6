import React from 'react';

import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import GraphExplorerMap from 'in-internal/GraphExplorer/GraphExplorerMap';
import { getSnapshot } from 'in-stores/snapshot';
import withUrlState from 'in-hoc/withUrlState';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import { compose } from 'recompose';

import locals from './GraphExplorer.mless';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/graphExplorer',
        name: 'snapshotId',
        as: 'snapshotId',
        initialState: '',
        parser: buildJsonParser(''),
        serializer: buildJsonSerializer()
      }
    ],
    reducerName: 'setSnapshotId'
  }),
  connectTo(({ snapshotId }) => ({
    snapshot: getSnapshot(snapshotId)
  }))
)(GraphExplorer);

function GraphExplorer({ snapshotId, setSnapshotId, snapshot }) {
  return (
    <div className={locals.view}>
      <Input
        className={locals.input}
        type="text"
        id="snapshotId-value"
        placeholder="snapshotId..."
        value={snapshotId}
        onChange={e => setSnapshotId({ snapshotId: e.target.value })}
        autoFocus
      />
      {snapshot && <GraphExplorerMap snapshot={snapshot} />}
    </div>
  );
}
