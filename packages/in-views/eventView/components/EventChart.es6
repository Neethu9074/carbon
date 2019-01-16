import React from 'react';

import {
  getChartTimeframeByEvent,
  getTimeConfigFromEventForCharts,
  getTimeConfigFromEventForSnapshotRetrieval
} from 'in-views/eventView/services/timeframe';

import EventMetricChartDownloadView from 'in-components/DownloadButton/components/EventMetricChartDownloadView';
import { getEntityOfType } from 'in-components/EntityInformation/entityUtils';
import { allowDownloadMetricsFromCharts } from 'in-services/featureFlags';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always, alwaysNull } from 'in-services/fixedStreams';
import addSection from 'in-views/eventView/hocs/addSection';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import DownloadButton from 'in-components/DownloadButton';
import { getRollupForTimeframe } from 'in-stores/metric';
import { emptyList } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import 'in-views/eventView/components/EventChart.less';

// Our current chart implementation can't handle dynamic windowSizes (dynamic = 1change/sec)
// If an event is open, we will subscribe to live metrics which causes moving timewindows.
// To avoid the chart running out of scope we add an offset to the windowSize.
const block = 'in-event-detail-chart';

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
        <div className={block}>
          {triggeringMetrics.map(metric => {
            const metricName = metric.get('metricName');
            const timeConfig = getChartTimeframeByEvent({ event, to });
            const rollup = getRollupForTimeframe(timeConfig);
            const anomalyConfig = anomalyMap[metricName];
            const plugin = translateFullyQualifiedPluginToShortPluginName(metric.get('entityId').get('pluginId'));

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
                timeConfig={getTimeConfigFromEventForCharts(event)}
                rollup={rollup}
                plugin={plugin}
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
    return getEntityOfType(
      props.entityId,
      props.entityType,
      getTimeConfigFromEventForSnapshotRetrieval(props.event),
      props.start
    );
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

    let chartConfig = getChartConfig(metric, entity, entityType);
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
      <div className={`${block}__chart`}>
        {allowDownloadMetricsFromCharts && (
          <div className={`${block}__button-panel`}>
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
            labels: [chartConfig.getLabel(entity, metric)],
            min: chartConfig.getMin(entity),
            max: chartConfig.getMax(entity),
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

function translateFullyQualifiedPluginToShortPluginName(fullyQualifiedPlugin) {
  for (const plugin in fullyQualifiedPlugins) {
    if (!fullyQualifiedPlugins.hasOwnProperty(plugin)) {
      continue;
    }

    if (fullyQualifiedPlugin === fullyQualifiedPlugins[plugin]) {
      return plugin;
    }
  }
  return null;
}

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}

function getChartConfig(metric, entity, entityType) {
  if (entityType === 'Service20') {
    return getMetricDefinition('service20', metric);
  } else if (entityType === 'App20') {
    return getMetricDefinition('application20', metric);
  } else if (entityType === 'Endpoint20') {
    return getMetricDefinition('endpoint20', metric);
  }
  // else assume 'Entity10'
  return getMetricDefinition(entity.get('plugin'), metric);
}
