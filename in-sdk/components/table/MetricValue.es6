import React from 'react';

import MetricValue from 'in-components/MetricValue';

export default function TableViewMetricValue(props) {
  return (
    <div style={{
           textAlign: 'right'
         }}>
      <MetricValue {...props} />
    </div>
  );
}
