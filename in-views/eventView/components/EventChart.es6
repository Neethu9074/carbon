import React from 'react';

import { getChartTimeframeByEvent } from 'in-views/eventView/services/timeframe';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always, alwaysNull } from 'in-services/fixedStreams';
import addSection from 'in-views/eventView/hocs/addSection';
import { getRollupForTimeframe } from 'in-stores/metric';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import 'in-views/eventView/components/EventChart.less';

// Our current chart implementation can't handle dynamic windowSizes (dynamic = 1change/sec)
// If an event is open, we will subscribe to live metrics which couses in mocing timewindows
// To avoid that the cahrt will run out of scope we add an offset to the windowSize
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
                snapshotId={metric.get('snapshotId')}
                start={event.get('start')}
                timeframe$={always(timeframe)}
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
    return {
      snapshot: getSnapshot(props.snapshotId, props.start)
    };
  },
  function ChartWrapper({ timeframe$, snapshot, snapshotId, metric, rollup, anomalyConfig }) {
    if (!snapshot) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }

    let forecastSensitivity;
    if (anomalyConfig) {
      const oneDay = 1000 * 60 * 60 * 24;
      forecastSensitivity = 100 * anomalyConfig.get('sensitivity', 1);
      timeframe$ = timeframe$.map(timeframe => {
        return {
          to: timeframe.to ? timeframe.to : Date.now() + oneDay,
          windowSize: oneDay * 14
        };
      });
    }

    const chartConfig = getMetricDefinition(snapshot.get('plugin'), metric);
    return (
      <div className={`${block}__chart`}>
        <Chart
          snapshotId={snapshotId}
          timeframe$={timeframe$}
          currentRollup={rollup}
          margins={{
            left: 80,
            right: 1
          }}
          avoidMarginOverrides
          y1={{
            metrics: [metric],
            labels: [chartConfig.getLabel(snapshot, metric)],
            min: chartConfig.getMin(snapshot),
            max: chartConfig.getMax(snapshot),
            type: 'line',
            formatter: chartConfig.formatter.compact,
            tooltipFormatter: chartConfig.formatter.detailed,
            enableForecast: anomalyConfig ? true : false,
            forecastSensitivity
          }}
        />
      </div>
    );
  }
);

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
