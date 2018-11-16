import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

import { KpiSection, KpiHeading } from 'in-sdk/components/dashboard/KpiSection';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import { getLabel } from 'in-sdk/snapshot';
import DatabaseTable from './DatabaseTable.es6';
import ElasticPoolTable from './ElasticPoolTable.es6';

export default function AzureSqlDatabaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
      </KpiSection>

      <DashboardSection title="Total DTU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['total_dtu_limit', 'total_dtu_used'],
            labels: ['Total DTU Limit', 'Total DTU Used'],
            formatter: zeroDecimalPlaces,
            type: 'area'
          }}
        />
      </DashboardSection>

      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
      <ElasticPoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
