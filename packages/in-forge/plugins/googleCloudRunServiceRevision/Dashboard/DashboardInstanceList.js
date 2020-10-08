import React from 'react';

import getInstancesForGoogleCloudRunServiceRevision from 'in-subscription/getInstancesForGoogleCloudRunServiceRevision';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    instances: timeConfig$
      .flatMap(timeConfig => getInstancesForGoogleCloudRunServiceRevision({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function DashboardInstanceList({ instances }) {
    if (!instances || instances.length === 0) {
      return null;
    }

    const cols = [
      {
        title: 'Instance',
        type: 'snapshotLink',
        typeArgs: {
          getSnapshotId(row) {
            return row.key;
          }
        }
      }
    ];

    const rows = instances.map(instance => ({ key: instance.get('id'), label: instance.get('label') }));

    return <Table withoutPadding cardTitle={`Instances (${rows.length})`} cols={cols} rows={rows} />;
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
