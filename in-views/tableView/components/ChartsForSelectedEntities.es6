import React from 'react';

import {selectedSnapshots$} from 'in-views/tableView/stores/selectedSnapshots';
import {metrics$, removeMetric} from 'in-views/tableView/stores/metrics';
import {plugin$} from 'in-views/tableView/stores/snapshotIds';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {getMetricDefinition} from 'in-sdk/metrics';
import SvgIcon from 'in-components/SvgIcon';
import {getPlural} from 'in-sdk/pluginName';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';

import './ChartsForSelectedEntities.less';

const block = 'in-table-view-charts';

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
    <div className={`${block}__chart`}>
      <h2 className={`${block}__chart-title`}>
        {definition.category.map((part, i) =>
          <span key={i}>
            {part}

            <SvgIcon height={9}
                     type='chevron_right'
                     className={`${block}__breadcrumb-separator`}/>
          </span>
        )}
        {definition.label}

        <Button onClick={() => removeMetric(metric)}
                kind='secondary'
                size='sm'
                className={`${block}__remove`}>
          Remove
        </Button>
      </h2>

      <ChartWithLegend snapshotIds={snapshots.map(s => s.get('id'))}
                       margins={{
                         left: 60
                       }}
                       y1={{
                         metrics: snapshots.map(s => definition.getMetric(s)),
                         labels: snapshots.map(s => getLabel(s)),
                         type: 'line',
                         min,
                         max,
                         formatter: definition.formatter.detailed,
                         tooltipFormatter: definition.formatter.detailed
                       }}/>
    </div>
  );
}

export default connectTo({
  metrics: metrics$,
  snapshots: selectedSnapshots$,
  plugin: plugin$
}, function ChartsForSelectedEntities({metrics, snapshots, plugin}) {
  metrics = metrics || [];
  snapshots = snapshots || [];
  snapshots = snapshots
    .filter(snapshot => !!snapshot);

  if (snapshots.length === 0 && metrics.length === 0) {
    return null;
  } else if (snapshots.length === 0 && metrics.length > 0) {
    return (
      <div className={`${block}__incomplete-selection`}>
        Please select {getPlural(plugin)} for which to visualize the chosen metrics.
      </div>
    );
  } else if (snapshots.length > 0 && metrics.length === 0) {
    return (
      <div className={`${block}__incomplete-selection`}>
        Please select metrics to visualize for the selected {getPlural(plugin)}.
      </div>
    );
  }

  return (
    <div className={block}>
      {metrics.map(metric =>
        <SelectedChart snapshots={snapshots}
                       metric={metric}
                       key={metric}/>
      )}
    </div>
  );
});
