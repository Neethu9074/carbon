import React from 'react';
import { KpiSection, KpiHeading } from 'in-sdk/components/dashboard/KpiSection';
import { getLabel } from 'in-sdk/snapshot';
import DatabaseTable from './DatabaseTable.es6';
import ElasticPoolTable from './ElasticPoolTable.es6';

export default function AzureSqlServerDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
      </KpiSection>

      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
      <ElasticPoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
