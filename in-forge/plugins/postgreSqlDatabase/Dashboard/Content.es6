import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DatabasesTable from 'in-forge/plugins/postgreSqlDatabase/Dashboard/DatabasesTable';
import DashboardNotification from 'in-components/DashboardNotification';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


const noActivityOnUglyMinusOneHackFormatter = d => d < 0 ? 'No activity' : zeroDecimalPlaces(d);

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
                       formatter={noActivityOnUglyMinusOneHackFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label='Committed Transactions'>
          <MetricValue snapshotId={snapshotId}
                       metric='totalCommittedTransactions'
                       formatter={noActivityOnUglyMinusOneHackFormatter} />
        </KpiKeyValue>
      </KpiSection>

    <DatabasesTable snapshot={snapshot}
                    timeframe={timeframe}/>
    </div>
  );
}
