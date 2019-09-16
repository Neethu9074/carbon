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
} from 'in-views/eventView/services/timeframe';
import EventMetricChartDownloadView from 'in-components/DownloadButton/components/EventMetricChartDownloadView';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always, alwaysNull } from 'in-services/fixedStreams';
import addSection from 'in-views/eventView/hocs/addSection';
import DownloadButton from 'in-components/DownloadButton';
import { getRollupForTimeframe } from 'in-stores/metric';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import locals from './EventChart.mless';

export default addSection(
  connectTo(
    props => {
      return {
        to: props.event.get('state') === 'closed' ? always(props.event.get('end')) : alwaysNull
      };
    },
    function EventChart({ to, event }) {
      const anomalyMap = {};
      event
        .getIn(['metadata', 'anomalies'], emptyList)
        .toArray()
        .forEach(anomalyConfig => (anomalyMap[anomalyConfig.get('metricName')] = anomalyConfig));

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
            const anomalyConfig = anomalyMap[metricName];
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
                timeConfig$={always(timeConfig)}
                plugin={plugin}
                timeConfig={getTimeConfigFromEvent(event)}
                rollup={rollup.label}
                anomalyConfig={anomalyConfig}
              />
            );
          })}
        </div>
      );
    }
  ),
  isVisible
);

const ChartWrapper = connectTo(
  props => {
    const { event, entityId, entityType } = props;
    if (isInfraEntityType(entityType)) {
      const timeConfig = getTimeConfigFromEventForSnapshotRetrieval(event);
      return {
        entity: getSnapshot(entityId, timeConfig).startWith(null)
      };
    } else {
      return createAppDataEntityConnectToMapFromEvent(entityType, entityId, event.get('metadata'));
    }
  },
  function ChartWrapper({
    timeConfig$,
    timeConfig,
    entity,
    entityType,
    metric,
    metricAccessId,
    rollup,
    anomalyConfig,
    event,
    plugin
  }) {
    if (!entity || (entity.progress && entity.progress.loading)) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }

    let chartConfig = getChartConfig(metric, entityType, entity);
    let forecastSensitivity;
    let focusedMoment;
    if (anomalyConfig) {
      const oneDay = 1000 * 60 * 60 * 24;
      forecastSensitivity = anomalyConfig.get('sensitivity', 50);
      focusedMoment = anomalyConfig.get('ts');
      timeConfig$ = timeConfig$.map(timeConfig => {
        const to = timeConfig.to ? timeConfig.to : Date.now() + oneDay;
        return {
          to: to,
          focusedMoment: to,
          windowSize: oneDay * 14
        };
      });
    }

    return (
      <div className={locals.chart}>
        {allowDownloadMetricsFromCharts && (
          <div className={locals.buttonPanel}>
            <DownloadButton>
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
          </div>
        )}

        <Chart
          snapshotId={metricAccessId}
          timeConfig$={timeConfig$}
          currentRollup={rollup}
          margins={{
            right: 1
          }}
          y1={{
            metrics: [metric],
            labels: [chartConfig.getLabel(entity, metric)], // TODO entity can be ommitted for app20
            min: chartConfig.getMin(entity), // TODO entity can be ommitted for app20
            max: chartConfig.getMax(entity), // TODO entity can be ommitted for app20
            type: 'line',
            formatter: chartConfig.formatter.compact,
            tooltipFormatter: chartConfig.formatter.detailed,
            enableForecast: anomalyConfig ? true : false,
            forecastSensitivity,
            focusedMoment
          }}
        />
      </div>
    );
  }
);

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}

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
