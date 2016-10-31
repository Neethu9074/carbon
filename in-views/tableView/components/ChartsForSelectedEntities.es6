import React from 'react';

import {selectedSnapshots$} from 'in-views/tableView/stores/selectedSnapshots';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {metrics$} from 'in-views/tableView/stores/metrics';
import {getMetricDefinition} from 'in-sdk/metrics';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

function SelectedChart({metric, snapshots}) {
  const definition = getMetricDefinition(snapshots[0].get('plugin'), metric);

  let max = undefined;
  let min = undefined;

  for (let i = 0, len = snapshots.length; i < len; i++) {
    const snapshot = snapshots[i];
    const snapshotMin = definition.getMin(snapshot);
    const snapshotMax = definition.getMax(snapshot);

    if (max == null || snapshotMax > max) {
      max = snapshotMax;
    }

    if (min == null || snapshotMin > min) {
      min = snapshotMin;
    }
  }

  return (
    <ChartWithLegend snapshotIds={snapshots.map(s => s.get('id'))}
                     margins={{
                       left: 60
                     }}
                     y1={{
                       metrics: snapshots.map(() => metric),
                       labels: snapshots.map(s => `${getLabel(s)}: ${definition.label}`),
                       type: 'line',
                       min,
                       max,
                       formatter: definition.compact,
                       tooltipFormatter: definition.detailed
                     }}/>
  );
}

export default connectTo({
  metrics: metrics$,
  snapshots: selectedSnapshots$
}, function ChartsForSelectedEntities({metrics, snapshots}) {
  if (!metrics || metrics.length === 0 || !snapshots || snapshots.length === 0) {
    return null;
  }

  return (
    <div>
      {metrics.map(metric =>
        <SelectedChart snapshots={snapshots}
                       metric={metric}
                       key={metric}/>
      )}
    </div>
  );
});
