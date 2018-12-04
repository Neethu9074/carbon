import React from 'react';
import StatusCode from './StatusCode.es6';
import Chart from 'in-components/Chart';
import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default function Collection({ snapshot, timeConfig, collection, statusCodes }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.tr'],
          labels: ['Total Requests'],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.mr'],
          labels: ['Metadata Requests'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.dc'],
          labels: ['Document Count'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [
            'metrics.collections.' + collection + '.du',
            'metrics.collections.' + collection + '.iu',
            'metrics.collections.' + collection + '.as',
            'metrics.collections.' + collection + '.dq'
          ],
          labels: ['Data Usage', 'Index Usage', 'Available Storage', 'Document Quota'],
          type: 'line'
        }}
      />

      <StatusCode snapshot={snapshot} timeConfig={timeConfig} collection={collection} statusCodes={statusCodes} />
    </div>
  );
}
