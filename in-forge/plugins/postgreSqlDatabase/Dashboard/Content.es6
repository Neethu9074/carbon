import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import {hitRateZeroDecimalPlaces} from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function PostgreSqlDashboard({snapshot, timeframe}) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='Queries'>
          <MetricValue snapshotId={snapshotId}
                       metric='totalQueries'
                       formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label='Committed Transactions'>
          <MetricValue snapshotId={snapshotId}
                       metric='totalCommittedTransactions'
                       formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

    <DatabasesTable snapshot={snapshot}
                    timeframe={timeframe} />
    </div>
  );
}
