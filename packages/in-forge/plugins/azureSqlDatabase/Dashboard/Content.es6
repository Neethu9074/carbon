import semver from 'semver';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import ElasticPoolTable from './ElasticPoolTable.es6';
import DatabaseTable from './DatabaseTable.es6';

export default function AzureSqlDatabaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  if (
    snapshot.get('data').get('sensorVersion') &&
    semver.satisfies(snapshot.get('data').get('sensorVersion'), '1.1.14')
  ) {
    return (
      <div>
        <DashboardSection>
          <h3>From version 1.1.14, Azure SQL Database Sensor is replaced with three new sensors</h3>
          <ul>
            <li>
              <strong>Azure SQL Server</strong>
            </li>
            <li>
              <strong>Azure SQL Db</strong>
            </li>
            <li>
              <strong>Azure SQL Elastic Pool</strong>
            </li>
          </ul>
        </DashboardSection>
      </div>
    );
  } else {
    return (
      <div>
        <DashboardSection title="Total DTU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['total_dtu_limit', 'total_dtu_used'],
              labels: ['Total DTU Limit', 'Total DTU Used'],
              formatter: number.detailed,
              type: 'area'
            }}
          />
        </DashboardSection>

        <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
        <ElasticPoolTable snapshot={snapshot} timeConfig={timeConfig} />
      </div>
    );
  }
}
