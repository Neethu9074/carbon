import { combineLatest } from 'reactive-observables';
import React from 'react';

import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import { getSnapshot, getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { evaluateClassNames } from 'in-services/util/classnames';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { focusedMoment$ } from 'in-stores/timeline';
import { compare } from 'in-services/util/boolean';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

const block = 'in-agent-view-table';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
      }
    }
  },
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getHostSnapshotId(row.snapshot);
      }
    }
  },
  {
    title: 'Boot Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'boot']);
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        switch (row.snapshot.getIn(['data', 'mode'])) {
          case 1:
            return 'Infrastructure';
          case 2:
            return 'Full APM';
          default:
            return 'Off';
        }
      }
    }
  },
  {
    title: 'Java Runtime',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.snapshot.getIn(['data', 'java', 'vmname'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`;
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        const snapshotTimestamp = row.snapshot.get('to');
        const isReporting = !snapshotTimestamp || snapshotTimestamp >= row.focusedMoment;
        return {
          value: isReporting,
          content: <Reporting isReporting={isReporting} />
        };
      }
    }
  }
];

export default connectTo(
  {
    agents: getSnapshotsInTimeframe('entity.selfType:agent')
      .flatMap(snapshots =>
        combineLatest(snapshots.map(snapshot => getSnapshot(snapshot.snapshotId, snapshot.timestamp)), false)
      )
      .throttle(200),
    focusedMoment: focusedMoment$
  },
  function AgentViewTable({ agents, focusedMoment }) {
    if (!agents) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = agents.filter(snapshot => snapshot).map(snapshot => {
      return {
        key: snapshot.get('id'),
        snapshotId: snapshot.get('id'),
        focusedMoment,
        snapshot
      };
    });

    return (
      <div className={block}>
        <Table maxItemsPerPage={20} cols={cols} rows={rows} />
      </div>
    );
  }
);

function Reporting({ isReporting }) {
  return (
    <div
      className={evaluateClassNames({
        [`${block}__reporting`]: true,
        [`${block}__is-reporting`]: isReporting
      })}
    >
      {`${isReporting ? 'reporting' : 'not reporting'}`}
    </div>
  );
}
