import React from 'react';

import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getHostsWithNomadContext } from 'in-internal/monitoringUnit/dataRetrieval';
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
    commonWorkersA: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"r4.4xlarge" OR entity.ec2.type:"r5.4xlarge") entity.zone:"*a" entity.zone:"Fleet*Worker*"'
    ),

    highperfWorkersA: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"m4.4xlarge" OR entity.ec2.type:"m5.4xlarge") entity.zone:"*a" entity.zone:"Fleet*Worker*"'
    ),

    commonWorkersB: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"r4.4xlarge" OR entity.ec2.type:"r5.4xlarge") entity.zone:"*b" entity.zone:"Fleet*Worker*"'
    ),

    highperfWorkersB: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"m4.4xlarge" OR entity.ec2.type:"m5.4xlarge") entity.zone:"*b" entity.zone:"Fleet*Worker*"'
    ),

    commonWorkersC: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"r4.4xlarge" OR entity.ec2.type:"r5.4xlarge") entity.zone:"*c" entity.zone:"Fleet*Worker*"'
    ),

    highperfWorkersC: getHostsWithNomadContext(
      'entity.host.name:"fleet-worker-*" (entity.ec2.type:"m4.4xlarge" OR entity.ec2.type:"m5.4xlarge") entity.zone:"*c" entity.zone:"Fleet*Worker*"'
    )
  },
  class WorkerStats extends React.Component {
    render() {
      const {
        commonWorkersA,
        highperfWorkersA,
        commonWorkersB,
        highperfWorkersB,
        commonWorkersC,
        highperfWorkersC
      } = this.props;

      return (
        <div>
          <DashboardSection title={`AZ a - ${commonWorkersA.length} common, ${highperfWorkersA.length} highperf`}>
            <Table
              cols={cols}
              rows={commonWorkersA}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
            <Table
              cols={cols}
              rows={highperfWorkersA}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
          </DashboardSection>

          <DashboardSection title={`AZ b - ${commonWorkersB.length} common, ${highperfWorkersB.length} highperf`}>
            <Table
              cols={cols}
              rows={commonWorkersB}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
            <Table
              cols={cols}
              rows={highperfWorkersB}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
          </DashboardSection>

          <DashboardSection title={`AZ c - ${commonWorkersC.length} common, ${highperfWorkersC.length} highperf`}>
            <Table
              cols={cols}
              rows={commonWorkersC}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
            <Table
              cols={cols}
              rows={highperfWorkersC}
              maxItemsPerPage={200}
              initialSortColumn={1}
              initialSortDirection="asc"
            />
          </DashboardSection>
        </div>
      );
    }
  }
);
