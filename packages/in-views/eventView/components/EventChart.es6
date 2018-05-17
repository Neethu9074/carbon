import React from 'react';

import { getChartTimeframeByEvent, getTimeConfigFromEvent } from 'in-views/eventView/services/timeframe';
import getApplication from 'in-subscription/application/getApplication';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import getService from 'in-subscription/application/getService';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always, alwaysNull } from 'in-services/fixedStreams';
import addSection from 'in-views/eventView/hocs/addSection';
import { getRollupForTimeframe } from 'in-stores/metric';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import { just } from 'reactive-observables';
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
            const timeframe = getChartTimeframeByEvent({ event, to });
            const rollup = getRollupForTimeframe(timeframe);
            const anomalyConfig = anomalyMap[metricName];

            return (
              <ChartWrapper
                key={metricName}
                metric={metricName}
                event={event}
                entityType={event.get('entityType')}
                entityId={event.get('entityId')}
                metricAccessId={event.get('metricAccessId')}
                start={event.get('start')}
                timeframe$={always(timeframe)}
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
    if (props.entityType === 'App20') {
      return {
        entity: getApplication({ id: props.entityId })
      };
    } else if (props.entityType === 'Service20') {
      if (!props.timeConfig) {
        //  Can't render 2.0 service information without a time config.
        return {
          entity: just(null)
        };
      }
      return {
        entity: getService({
          id: props.entityId,
          filter: {
            timeConfig: props.timeConfig
          }
        })
      };
    } else {
      return {
        entity: getSnapshot(props.entityId, props.start)
      };
    }
  },
  function ChartWrapper({ timeframe$, entity, entityType, metric, metricAccessId, rollup, anomalyConfig }) {
    if (!entity || (entity.progress && entity.progress.loading)) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }

    let chartConfig;
    if (entityType === 'Entity10') {
      chartConfig = getMetricDefinition(entity.get('plugin'), metric);
    } else if (entityType === 'Service20') {
      chartConfig = getMetricDefinition('service20', metric);
    } else if (entityType === 'App20') {
      chartConfig = getMetricDefinition('application20', metric);
    }

    let forecastSensitivity;
    let focusedMoment;
    if (anomalyConfig) {
      const oneDay = 1000 * 60 * 60 * 24;
      forecastSensitivity = anomalyConfig.get('sensitivity', 50);
      focusedMoment = anomalyConfig.get('ts');
      timeframe$ = timeframe$.map(timeframe => {
        return {
          to: timeframe.to ? timeframe.to : Date.now() + oneDay,
          windowSize: oneDay * 14
        };
      });
    }

    return (
      <div className={`${block}__chart`}>
        <Chart
          snapshotId={metricAccessId}
          timeframe$={timeframe$}
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

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
