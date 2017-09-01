import React from 'react';

import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import { evaluateClassNames } from 'in-services/util/classnames';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { compare } from 'in-services/util/boolean';
import { getSnapshot } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
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
      getSnapshot$(row) {
        return getHostSnapshotId(row.snapshot).flatMap(hostId => {
          return hostId ? getSnapshot(hostId, row.snapshot.get('from')) : alwaysNull;
        });
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
        return modes[row.snapshot.getIn(['data', 'mode'])];
      }
    }
  },
  {
    title: 'Java Runtime',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return `${row.snapshot.getIn(['data', 'java', 'vmvendor'])} ${row.snapshot.getIn(['data', 'java', 'version'])}`;
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        return {
          value: row.isReportingAtFocusedMoment,
          content: (
            <Tooltip content={getTooltipReportingText(row)} align={'rightMiddle'}>
              <Reporting isReporting={row.isReportingAtFocusedMoment} />
            </Tooltip>
          )
        };
      }
    }
  }
];

export default connectTo(
  {
    agentSnapshots: getSnapshotsInTimeframe('entity.selfType:agent')
  },
  function AgentViewTable({ agentSnapshots }) {
    if (!agentSnapshots) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = [];
    agentSnapshots.get('online', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        isReportingAtFocusedMoment: true
      });
    });
    agentSnapshots.get('offline', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        isReportingAtFocusedMoment: false
      });
    });

    return (
      <div className={block}>
        <Table maxItemsPerPage={20} cols={cols} rows={rows} initialSortColumn={5} />
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

function getTooltipReportingText(row) {
  let text = row.isReportingAtFocusedMoment
    ? ''
    : 'The agent reported in the selected time range but has not reported at the selected moment. ';
  if (!row.snapshot.get('to')) {
    text += `The agent started at ${formatDateTime(row.snapshot.get('from'))} and is still reporting.`;
  } else {
    text += `The agent reported between: ${formatDateTime(row.snapshot.get('from'))} and ${formatDateTime(
      row.snapshot.get('to')
    )}.`;
  }
  return text;
}
