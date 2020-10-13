import React from 'react';

import getProcessesForGoogleCloudRunServiceRevision from 'in-subscription/getProcessesForGoogleCloudRunServiceRevision';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    processes: timeConfig$
      .flatMap(timeConfig => getProcessesForGoogleCloudRunServiceRevision({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function DashboardProcessList({ processes }) {
    if (!processes || processes.length === 0) {
      return null;
    }

    const cols = [
      {
        title: 'Process',
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = processes.map(process => ({ key: process.get('id'), label: process.get('label') }));

    return <Table withoutPadding cardTitle={`Processes (${rows.length})`} cols={cols} rows={rows} />;
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
