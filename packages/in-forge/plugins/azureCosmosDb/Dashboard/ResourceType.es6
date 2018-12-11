import React from 'react';
import Chart from 'in-components/Chart';
import emptyList from 'in-services/fixedImmutables';
import zeroDecimalPlaces from 'in-services/formatters/number';

export default function ResourceType({ snapshot, timeConfig, collection, resourceTypes }) {
  const snapshotId = snapshot.get('id');
  const instanceApi = snapshot.getIn(['data', 'meta.instance.api']);

  var codeMetricsLeft = emptyList;
  var codeLabelsLeft = emptyList;

  var codeMetricsRight = emptyList;
  var codeLabelsRight = emptyList;

  resourceTypes.map(type => {
    var metric = 'metrics.statusCodes.' + type + '.tr';
    var label = type.substring(type.lastIndexOf('.') + 1);
    if (type.startsWith(collection)) {
      if (instanceApi == 'MongoDB' && label.endsWith(')')) {
        codeMetricsRight = codeMetricsRight.push(metric);
        codeLabelsRight = codeLabelsRight.push(label);
      } else {
        codeMetricsLeft = codeMetricsLeft.push(metric);
        codeLabelsLeft = codeLabelsLeft.push(label);
      }
    }
  });

  if (codeMetricsLeft.size == 0 && codeMetricsRight.size == 0) return <div />;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: codeMetricsLeft.toArray(),
          labels: codeLabelsLeft.toArray(),
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: codeMetricsRight.toArray(),
          labels: codeLabelsRight.toArray(),
          type: 'line'
        }}
      />
    </div>
  );
}
