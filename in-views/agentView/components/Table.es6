import { combineLatest } from 'reactive-observables';
import React from 'react';

import { getSnapshot, getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { evaluateClassNames } from 'in-services/util/classnames';
import LoadingIndicator from 'in-components/LoadingIndicator';
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
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'Boot Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot ? row.snapshot.getIn(['data', 'boot']) : '';
      }
    }
  },
  {
    title: 'Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        if (!row.snapshot) {
          return '';
        }

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
        return row.snapshot
          ? `${row.snapshot.getIn(['data', 'java', 'vmname'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`
          : '';
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        const isReporting = row.snapshot ? true : false;
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
      .flatMap(ids => combineLatest(ids.map(id => getSnapshot(id).startWith(id)), false))
      .throttle(200)
  },
  function AgentViewTable({ agents }) {
    if (!agents) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = agents.map(snapshot => {
      if (typeof snapshot === 'string') {
        return {
          key: snapshot,
          snapshotId: snapshot
        };
      }
      return {
        key: snapshot.get('id'),
        snapshotId: snapshot.get('id'),
        snapshot
      };
    });

    return (
      <div className={block}>
        <Table maxItemsPerPage={20} cols={cols} rows={rows} getRowDetails={getRowDetails} />
      </div>
    );
  }
);

function getRowDetails() {
  return (
    <div>
      hallo
    </div>
  );
}

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
