import React from 'react';

import {selectedSnapshots$} from 'in-views/tableView/stores/selectedSnapshots';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {metrics$} from 'in-views/tableView/stores/metrics';
import {getMetricDefinition} from 'in-sdk/metrics';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

function SelectedChart({metric, snapshots}) {
  const firstSnapshot = snapshots[0];
  const definition = getMetricDefinition(firstSnapshot.get('plugin'), metric);
  console.log(definition);
  return (
    <ChartWithLegend snapshotIds={snapshots.map(s => s.get('id'))}
                     margins={{
                       left: 60
                     }}
                     y1={{
                       metrics: snapshots.map(() => metric),
                       labels: snapshots.map(s => `${getLabel(s)}: ${definition.label}`),
                       type: 'line',
                       min: definition.getMin(firstSnapshot),
                       max: definition.getMax(firstSnapshot),
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
