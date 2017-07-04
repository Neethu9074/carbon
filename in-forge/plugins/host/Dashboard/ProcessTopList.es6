import React from 'react';

import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import getProcessSnapshotIdForPid from 'in-services/subscription/processSnapshotIdForPid';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'PID',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('pid');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'Process Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getProcessSnapshotIdForPid({
          pid: row.process.get('pid'),
          hostSnapshot: row.host
        });
      },
      withHierarchy: true,
      getFallbackContent(row) {
        return row.process.get('name');
      },
      useSnapshotFromHierarchyCallback(snapshot, hierarchy) {
        if (hierarchy && hierarchy.length > 0) {
          return hierarchy[0];
        }
        return snapshot;
      }
    }
  },
  {
    title: 'CPU',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('cpu');
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      processes: getRawPayload(props.snapshot.get('id'), 'processes')
    };
  },
  function ProcessTopList({ snapshot, processes }) {
    if (!processes || processes.size === 0) {
      return null;
    }

    const rows = processes.toArray().map(process => {
      return {
        key: String(process.get('pid')),
        process,
        host: snapshot
      };
    });

    return (
      <DashboardSection title="Process Top List">
        <Table cols={cols} rows={rows} initialSortColumn={2} initialSortDirection={'desc'} />
      </DashboardSection>
    );
  }
);
