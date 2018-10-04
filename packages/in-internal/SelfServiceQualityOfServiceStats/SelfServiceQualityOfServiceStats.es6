import React from 'react';

import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getHostsWithNomadContext } from 'in-internal/dataRetrieval';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
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

export default connectTo(
  {
    rowsEuA: getHostsWithNomadContext('entity.zone:selfservice*worker* eu-west-1a'),
    rowsUsA: getHostsWithNomadContext('entity.zone:selfservice*worker* us-west-2a'),
    rowsEuB: getHostsWithNomadContext('entity.zone:selfservice*worker* eu-west-1b'),
    rowsUsB: getHostsWithNomadContext('entity.zone:selfservice*worker* us-west-2b'),
    rowsEuC: getHostsWithNomadContext('entity.zone:selfservice*worker* eu-west-1c'),
    rowsUsC: getHostsWithNomadContext('entity.zone:selfservice*worker* us-west-2c')
  },
  class SelfServiceQualityOfServiceStats extends React.Component {
    render() {
      const { rowsEuA, rowsUsA, rowsEuB, rowsUsB, rowsEuC, rowsUsC } = this.props;

      let rowsA = rowsEuA.concat(rowsUsA);
      let rowsB = rowsEuB.concat(rowsUsB);
      let rowsC = rowsEuC.concat(rowsUsC);

      return (
        <div>
          <h1>Quality of Service - SelfService Fleet Worker</h1>
          <DashboardSection title={`Availability Zone A (${rowsA.length})`}>
            <Table cols={cols} rows={rowsA} maxItemsPerPage={200} initialSortColumn={3} initialSortDirection="desc" />
          </DashboardSection>
          <DashboardSection title={`Availability Zone B (${rowsB.length})`}>
            <Table cols={cols} rows={rowsB} maxItemsPerPage={200} initialSortColumn={3} initialSortDirection="desc" />
          </DashboardSection>
          <DashboardSection title={`Availability Zone C (${rowsC.length})`}>
            <Table cols={cols} rows={rowsC} maxItemsPerPage={200} initialSortColumn={3} initialSortDirection="desc" />
          </DashboardSection>
        </div>
      );
    }
  }
);
