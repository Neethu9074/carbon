import React from 'react';

import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getHostsWithNomadContext } from 'in-internal/dataRetrieval';
import { number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Host',
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: 'Host CPU load',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `load.1min`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Nomad Allocated Memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.nomad.get('id');
      },
      getMetricName() {
        return 'nomad.client.allocated.memory';
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Nomad Unallocated Memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.nomad.get('id');
      },
      getMetricName() {
        return 'nomad.client.unallocated.memory';
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Nomad Allocated CPU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.nomad.get('id');
      },
      getMetricName() {
        return 'nomad.client.allocated.cpu';
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Nomad Unallocated CPU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.nomad.get('id');
      },
      getMetricName() {
        return 'nomad.client.unallocated.cpu';
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getHostsWithNomadContext('entity.zone:fleet*worker')
})(function QualityOfServiceStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <h1>Quality of Service</h1>

      <DashboardSection title={`Fleet Worker (${rows.length})`}>
        <Table cols={cols} rows={rows} maxItemsPerPage={200} />
      </DashboardSection>
    </div>
  );
});
