import React from 'react';

import {
  isInfraEntityType,
  isApplicationEntity,
  isEndpointEntity,
  isServiceEntity,
  createAppDataEntityConnectToMapFromEvent
} from 'in-services/entityUtils';
import {
  getChartTimeConfigByEvent,
  getTimeConfigFromEvent,
  getTimeConfigFromEventForSnapshotRetrieval
} from 'in-events/timeframe';
import EventMetricChartDownloadView from 'in-components/DownloadButton/components/EventMetricChartDownloadView';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import { always, alwaysNull } from 'in-services/fixedStreams';
import DownloadButton from 'in-components/DownloadButton';
import { getRollupForTimeframe } from 'in-stores/metric';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './EventChart.mless';

export default connectTo(
  props => {
    return {
      to: props.event.get('state') === 'closed' ? always(props.event.get('end')) : alwaysNull
    };
  },
  function EventChart({ to, event }) {
    const triggeringMetrics = event
      .getIn(['metadata', 'metrics'], emptyList)
      .toArray()
      .sort((a, b) => a.get('metricName').localeCompare(b.get('metricName')));

    return (
      <div className={locals.wrapper}>
        {triggeringMetrics.map(metric => {
          const metricName = metric.get('metricName');
          const timeConfig = getChartTimeConfigByEvent({ event, to });
          const rollup = getRollupForTimeframe(timeConfig);
          const plugin = translateFullyQualifiedPluginToShortPluginName(metric.getIn(['entityId', 'pluginId']));

          return (
            <ChartWrapper
              key={metricName}
              metric={metricName}
              event={event}
              entityType={event.get('entityType')}
              entityId={event.get('entityId')}
              metricAccessId={event.get('metricAccessId')}
              start={event.get('start')}
              plugin={plugin}
              timeConfig={getTimeConfigFromEvent(event)}
              rollup={rollup.label}
            />
          );
        })}
      </div>
    );
  }
);

const ChartWrapper = connectTo(
  props => {
    const { event, entityId, entityType } = props;
    let observables = {};
    if (isInfraEntityType(entityType)) {
      const timeConfig = getTimeConfigFromEventForSnapshotRetrieval(event);
      observables.entity = getSnapshot(entityId, timeConfig).startWith(null);
      return observables;
    }
    observables = {
      ...createAppDataEntityConnectToMapFromEvent(entityType, entityId, event.get('metadata')),
      ...observables
    };
    return observables;
  },
  function ChartWrapper({ timeConfig, entity, entityType, metric, metricAccessId, rollup, event, plugin }) {
    if (!entity || (entity.progress && entity.progress.loading)) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }
    const chartConfig = getChartConfig(metric, entityType, entity);

    return (
      <div className={locals.chart}>
        <div className={locals.buttonPanel}>
          {allowDownloadMetricsFromCharts && (
            <DownloadButton className={locals.downloadButton}>
              <EventMetricChartDownloadView
                metric={metric}
                entityType={entityType}
                event={event}
                rollup={rollup.rollup}
                plugin={plugin}
                timeConfig={timeConfig}
                metricAccessId={metricAccessId}
              />
            </DownloadButton>
          )}
        </div>
        <Chart
          snapshotId={metricAccessId}
          timeConfig={timeConfig}
          y1={{
            metrics: [metric],
            labels: [chartConfig.getLabel(entity, metric)], // TODO entity can be ommitted for app20
            min: chartConfig.getMin(entity), // TODO entity can be ommitted for app20
            max: chartConfig.getMax(entity), // TODO entity can be ommitted for app20
            type: 'line',
            formatter: chartConfig.formatter.compact,
            tooltipFormatter: chartConfig.formatter.detailed
          }}
        />
      </div>
    );
  }
);

function getChartConfig(metric, entityType, entity) {
  if (isApplicationEntity(entityType)) {
    return getMetricDefinition('application', metric);
  } else if (isServiceEntity(entityType)) {
    return getMetricDefinition('service', metric);
  } else if (isEndpointEntity(entityType)) {
    return getMetricDefinition('endpoint', metric);
  }
  // else assume 'Entity10'
  return getMetricDefinition(entity.get('plugin'), metric);
}
