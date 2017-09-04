import React from 'react';

import NotificationIndicator from 'in-views/agentView/components/NotificationIndicator';
import ReportingIndicator from 'in-views/agentView/components/ReportingIndicator';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import { compare as compareBoolean } from 'in-services/util/boolean';
import { compare as compareNumber } from 'in-services/util/number';
import RowDetails from 'in-views/agentView/components/RowDetails';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

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
          const to = row.snapshot.get('to') || Date.now();
          const reportingWindowSize = to - row.snapshot.get('from');
          const reportingCenterTime = row.snapshot.get('from') + reportingWindowSize / 2;
          return hostId ? getSnapshot(hostId, reportingCenterTime) : alwaysNull;
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
      comparator: compareBoolean,
      get(row) {
        return {
          value: row.isReportingAtFocusedMoment,
          content: <ReportingIndicator row={row} />
        };
      }
    }
  },
  {
    title: 'Status',
    type: 'custom',
    typeArgs: {
      comparator: compareNumber,
      get(row) {
        return {
          value: row.snapshot.getIn(['data', 'notifications'], emptyList).size,
          content: <NotificationIndicator row={row} />
        };
      }
    }
  }
];

export default connectTo(
  {
    agentSnapshots: getSnapshotsInTimeframe('entity.selfType:agent'),
    focusedMoment: focusedMoment$
  },
  function AgentViewTable({ agentSnapshots, focusedMoment }) {
    if (!agentSnapshots) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = [];
    agentSnapshots.get('online', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        focusedMoment,
        isReportingAtFocusedMoment: true
      });
    });
    agentSnapshots.get('offline', emptyList).forEach(snapshot => {
      rows.push({
        key: snapshot.get('id'),
        snapshot: snapshot,
        focusedMoment,
        isReportingAtFocusedMoment: false
      });
    });

    return <Table maxItemsPerPage={20} cols={cols} rows={rows} initialSortColumn={5} getRowDetails={getRowDetails} />;
  }
);

function getRowDetails(row) {
  return <RowDetails row={row} />;
}
