import { just, combineLatest } from 'reactive-observables';
import React from 'react';

import MetricChartDownloadView from 'in-components/DownloadButton/components/MetricChartDownloadView';
import { selectedSnapshots$ } from 'in-views/tableView/stores/selectedSnapshots';
import { metrics$, removeMetric } from 'in-views/tableView/stores/metrics';
import { plugin$ } from 'in-views/tableView/stores/snapshotIds';
import DownloadButton from 'in-components/DownloadButton';
import { getTableDefinition } from 'in-sdk/snapshot';
import { getMetricDefinition } from 'in-sdk/metrics';
import { getPlural } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './ChartsForSelectedEntities.less';

const block = 'in-table-view-charts';

function SelectedChart({ metric, snapshots, labels }) {
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
        {definition.category.map((part, i) => (
          <span key={i}>
            {part}

            <SvgIcon height={9} type="chevron_right" className={`${block}__breadcrumb-separator`} />
          </span>
        ))}
        {definition.label}

        <div className={`${block}__button-panel`}>
          <DownloadButton>
            <MetricChartDownloadView metric={metric} label={definition.label} snapshots={snapshots} />
          </DownloadButton>

          <Button onClick={() => removeMetric(metric)} kind="secondary" size="sm" className={`${block}__button`}>
            Remove
          </Button>
        </div>
      </h2>

      <Chart
        snapshotIds={snapshots.map(s => s.get('id'))}
        y1={{
          metrics: snapshots.map(() => definition.metric),
          labels,
          type: 'line',
          min,
          max,
          formatter: definition.formatter.detailed,
          tooltipFormatter: definition.formatter.detailed
        }}
      />
    </div>
  );
}

export default connectTo(
  {
    metrics: metrics$,
    snapshots: selectedSnapshots$,
    plugin: plugin$,
    labels: combineLatest([plugin$, selectedSnapshots$]).flatMap(([plugin, selectedSnapshots]) => {
      const tableDefinition = getTableDefinition(plugin);
      if (tableDefinition.getChartLabel$ == null) {
        return just(selectedSnapshots.map(getLabel));
      }

      return combineLatest(selectedSnapshots.map(s => tableDefinition.getChartLabel$(s).startWith(getLabel(s))));
    })
  },
  function ChartsForSelectedEntities({ metrics, snapshots, plugin, labels }) {
    metrics = metrics || [];
    snapshots = snapshots || [];
    snapshots = snapshots.filter(snapshot => !!snapshot);
    labels = labels || [];

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

    if (labels.length !== snapshots.length) {
      return null;
    }

    return (
      <div className={block}>
        {metrics.map(metric => <SelectedChart snapshots={snapshots} metric={metric} key={metric} labels={labels} />)}
      </div>
    );
  }
);
