import React from 'react';

import CollectionsTable from 'in-forge/plugins/azureCosmosDb/Dashboard/DatabaseTable';
import DatabaseTable from 'in-forge/plugins/azureCosmosDb/Dashboard/DatabaseTable';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function Region({ snapshot, timeConfig, region, databases, collections, statusCodes, resourceTypes }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.regions.' + region + '.tr'],
          labels: ['Total Requests'],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.regions.' + region + '.mr'],
          labels: ['Metadata Requests'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.regions.' + region + '.dc'],
          labels: ['Document Count'],
          type: 'line'
        }}
      />
      {databases != null && databases.size > 0 ? (
        <DatabaseTable
          snapshot={snapshot}
          timeConfig={timeConfig}
          region={region}
          databases={databases}
          collections={collections}
          statusCodes={statusCodes}
          resourceTypes={resourceTypes}
        />
      ) : (
        <CollectionsTable
          snapshot={snapshot}
          timeConfig={timeConfig}
          region={region}
          database={null}
          collections={collections}
          statusCodes={statusCodes}
          resourceTypes={resourceTypes}
        />
      )}
    </>
  );
}
