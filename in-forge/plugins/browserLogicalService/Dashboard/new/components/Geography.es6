import React from 'react';

import { twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/EumChart';

export default function Overview({ snapshot }) {
  return (
    <div>
      Geography
      <Chart
        snapshotId={snapshot.get('id')}
        dynamicRollupAggregation="sum"
        y1={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['count', 'xhrCalls'],
          labels: ['calls/s', 'Calls'],
          type: 'bar'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['xhrErrors'],
          labels: ['Errors'],
          type: 'line'
        }}
      />
    </div>
  );
}
