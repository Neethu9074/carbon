import React from 'react';

import { getChartTimeframeByEvent } from 'in-views/eventView/services/timeframe';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import addSection from 'in-views/eventView/hocs/addSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always, alwaysNull } from 'in-services/fixedStreams';
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

            return (
              <ChartWrapper
                key={metricName}
                metric={metricName}
                snapshotId={metric.get('snapshotId')}
                start={event.get('start')}
                timeframe$={always(timeframe)}
                rollup={rollup.label}
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
  function ChartWrapper({ timeframe$, snapshot, snapshotId, metric, rollup }) {
    if (!snapshot) {
      return <LoadingIndicator inline type="dark" style={{ height: '16px' }} />;
    }

    const chartConfig = getMetricDefinition(snapshot.get('plugin'), metric);
    return (
      <div className={`${block}__chart`}>
        <Chart
          snapshotId={snapshotId}
          timeframe$={timeframe$}
          currentRollup={rollup}
          margins={{
            left: 80
          }}
          y1={{
            metrics: [metric],
            labels: [chartConfig.getLabel(snapshot, metric)],
            min: chartConfig.getMin(snapshot),
            max: chartConfig.getMax(snapshot),
            type: 'line',
            formatter: chartConfig.formatter.detailed,
            tooltipFormatter: chartConfig.formatter.detailed
          }}
        />
      </div>
    );
  }
);

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
