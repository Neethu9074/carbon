/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon, CarbonButton, Message } from '@instana/components';
import { just, combineLatest } from '@instana/observables';

import MetricChartDownloadView from 'in-components/DownloadButton/components/MetricChartDownloadView';
import { selectedSnapshots$ } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { metrics$, removeMetric } from 'in-infrastructure/tableView/stores/metrics';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { plugin$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import DownloadButton from 'in-components/DownloadButton/DownloadButton';
import { getTableDefinition } from 'in-sdk/snapshot';
import { getMetricDefinition } from 'in-sdk/metrics';
import { timeConfig$ } from 'in-stores/time/config';
import { getPluginName } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ChartsForSelectedEntities.mless';

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
    <div className={locals.chart}>
      <h2 className={locals.chartTitle}>
        <div className={locals.breadcrumbs}>
          {definition.category.map((part, i) => (
            <Fragment key={i}>
              {part}
              <SvgIcon className={locals.breadcrumbSeparator} type="lib_arrow_expand_right" size="xs" />
            </Fragment>
          ))}
          {definition.label}
        </div>

        <div className={locals.buttonPanel}>
          <DownloadButton>
            <MetricChartDownloadView metric={metric} label={definition.label} snapshots={snapshots} />
          </DownloadButton>

          <CarbonButton onClick={() => removeMetric(metric)} kind="secondary" size="md" className={locals.button}>
            {t('in-infrastructure:tableView.remove')}
          </CarbonButton>
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
    labels = labels || [];

    if (snapshots.length === 0 && metrics.length === 0) {
      return null;
    } else if (snapshots.length === 0 && metrics.length > 0) {
      return (
        <Message type="warning" fullInlineWidth title={t('in-infrastructure:tableView.selectEntries')}>
          {t('in-infrastructure:tableView.pleaseSelectForWhichToVisualizeTheChosenMetrics', {
            plugins: getPluginName(plugin, 0)
          })}
        </Message>
      );
    } else if (snapshots.length > 0 && metrics.length === 0) {
      return (
        <Message type="warning" fullInlineWidth title={t('in-infrastructure:tableView.selectMetrics')}>
          {t('in-infrastructure:tableView.pleaseSelectMetricsToVisualizeForTheSelected', {
            plugins: getPluginName(plugin, snapshots.length)
          })}
        </Message>
      );
    }

    if (labels.length !== snapshots.length) {
      return null;
    }

    return (
      <div className={locals.inTableViewCharts}>
        {metrics.map(metric => (
          <SelectedChart snapshots={snapshots} metric={metric} key={metric} labels={labels} timeConfig={timeConfig} />
        ))}
      </div>
    );
  }
);
