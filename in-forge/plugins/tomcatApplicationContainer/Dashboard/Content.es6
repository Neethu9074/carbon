import React from 'react';

import DataSourcesTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/DataSourcesTable';
import ConnectorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ConnectorsTable';
import ExecutorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ExecutorsTable';
import WebAppsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/WebAppsTable';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function TomcatDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label="#Sessions">
          <MetricValue snapshotId={snapshot.get('id')} metric="totalSessionCount" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Total session count">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['totalSessionCount'],
            labels: ['Total session count'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <WebAppsTable snapshot={snapshot} timeframe={timeframe} />
      <ConnectorsTable snapshot={snapshot} timeframe={timeframe} />
      <ExecutorsTable snapshot={snapshot} timeframe={timeframe} />
      <DataSourcesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
