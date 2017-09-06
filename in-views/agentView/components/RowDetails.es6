import React from 'react';

import { getSnapshot, getSnapshotsMatchingHostId } from 'in-stores/snapshot';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import connectTo from 'in-hoc/connectTo';

import './RowDetails.less';

const block = 'in-in-agent-view-table-row-details';

export default function RowDetails({ row }) {
  const notifications = row.snapshot.getIn(['data', 'notifications']);
  if (!notifications) {
    return (
      <div className={block}>
        There are no notifications for this agent. Great job!
        <SnapshotList snapshot={row.snapshot} />
      </div>
    );
  }
}

const SnapshotList = connectTo(
  props => {
    return {
      snapshotIds: getSnapshotsMatchingHostId(props.snapshot).startWith([])
    };
  },
  function({ snapshotIds }) {
    return (
      <ul>
        {snapshotIds.map(snapshotId => <Snapshot key={snapshotId} snapshotId={snapshotId} />)}
      </ul>
    );
  }
);

const Snapshot = connectTo(
  props => {
    return { snapshot: getSnapshot(props.snapshotId) };
  },
  function Snapshot({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return <HierarchicalLink snapshot={snapshot} calculateHierarchy={false} kind="dark" />;
  }
);
