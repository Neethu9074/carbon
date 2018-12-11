import React from 'react';
import CollectionsTable from './CollectionsTable.es6';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import zeroDecimalPlaces from 'in-services/formatters/number';

export default function Region({ snapshot, timeConfig, region, collections, statusCodes, resourceTypes }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={snapshot.getIn(['data', 'meta.regions.' + region])}>
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

        <CollectionsTable
          snapshot={snapshot}
          timeConfig={timeConfig}
          region={region}
          collections={collections}
          statusCodes={statusCodes}
          resourceTypes={resourceTypes}
        />
      </DashboardSection>
    </div>
  );
}
