/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just, combineLatest } from '@instana/observables';
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import MetricChartDownloadView from 'in-components/DownloadButton/components/MetricChartDownloadView';
import { selectedSnapshots$ } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { metrics$, removeMetric } from 'in-infrastructure/tableView/stores/metrics';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { plugin$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import DownloadButton from 'in-components/DownloadButton';
import { getTableDefinition } from 'in-sdk/snapshot';
import { getMetricDefinition } from 'in-sdk/metrics';
import { timeConfig$ } from 'in-stores/time/config';
import { getPlural } from 'in-sdk/pluginName';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './ChartsForSelectedEntities.less';

const block = 'in-table-view-charts';

function SelectedChart({ metric, snapshots, timeConfig, labels }) {
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
        <div className={`${block}__breadcrumbs`}>
          {definition.category.map((part, i) => (
            <Fragment key={i}>
              {part}
              <SvgIcon className={`${block}__breadcrumb-separator`} type="lib_arrow_expand_right" size="xs" />
            </Fragment>
          ))}
          {definition.label}
        </div>

        <div className={`${block}__button-panel`}>
          <DownloadButton>
            <MetricChartDownloadView metric={metric} label={definition.label} snapshots={snapshots} />
          </DownloadButton>

          <Button onClick={() => removeMetric(metric)} kind="secondary" size="compact" className={`${block}__button`}>
            {t('in-infrastructure:tableView.remove')}
          </Button>
        </div>
      </h2>

      <Chart
        snapshotIds={snapshots.map(s => s.get('id'))}
        timeConfig={timeConfig}
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
    timeConfig: timeConfig$,
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
  function ChartsForSelectedEntities({ metrics, snapshots, plugin, timeConfig, labels }) {
    metrics = metrics || [];
    snapshots = snapshots || [];
    snapshots = snapshots.filter(snapshot => !!snapshot);
    labels = labels || [];

    if (snapshots.length === 0 && metrics.length === 0) {
      return null;
    } else if (snapshots.length === 0 && metrics.length > 0) {
      return (
        <div className={`${block}__incomplete-selection`}>
          {t('in-infrastructure:tableView.pleaseSelectForWhichToVisualizeTheChosenMetrics', {
            plugins: getPlural(plugin)
          })}
        </div>
      );
    } else if (snapshots.length > 0 && metrics.length === 0) {
      return (
        <div className={`${block}__incomplete-selection`}>
          {t('in-infrastructure:tableView.pleaseSelectMetricsToVisualizeForTheSelected', {
            plugins: getPlural(plugin)
          })}
        </div>
      );
    }

    if (labels.length !== snapshots.length) {
      return null;
    }

    return (
      <div className={block}>
        {metrics.map(metric => (
          <SelectedChart snapshots={snapshots} metric={metric} key={metric} labels={labels} timeConfig={timeConfig} />
        ))}
      </div>
    );
  }
);
