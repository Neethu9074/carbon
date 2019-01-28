import React from 'react';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import LdapConnectorsTable from './LdapConnectorsTable';
import RecentChangesTable from './RecentChangesTable';

export default function PingDirectoryDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title="Operations">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['operations_in_progress', 'searches_in_progress'],
            labels: ['Operations', 'Searches'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['established_connections', 'max_concurrent_connections', 'total_connections_since_startup'],
            labels: ['Established connections', 'Max concurrent connections', 'Total connections'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Descriptors">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['available_file_descriptors', 'open_file_descriptors', 'max_file_descriptors'],
            labels: ['Available descriptors', 'Open descriptors', 'Max descriptors'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Failed operations">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'all_ops_failed',
              'add_op_failed',
              'bind_op_failed',
              'compare_op_failed',
              'delete_op_failed',
              'extended_op_failed',
              'modify_op_failed',
              'search_op_failed'
            ],
            labels: [
              'All failed operations',
              'Add op failed',
              'Bind op failed',
              'Compare op failed',
              'Delete op failed',
              'Extended op failed',
              'Modify op failed',
              'Search op failed'
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Total operations">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'all_ops_total',
              'add_op_total',
              'bind_op_total',
              'compare_op_total',
              'delete_op_total',
              'extended_op_total',
              'modify_op_total',
              'search_op_total'
            ],
            labels: [
              'All operations',
              'Add op total',
              'Bind op total',
              'Compare op total',
              'Delete op total',
              'Extended op total',
              'Modify op total',
              'Search op total'
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <LdapConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
      <RecentChangesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
