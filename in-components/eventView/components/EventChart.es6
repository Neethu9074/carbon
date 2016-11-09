import React from 'react';

import {getMetricDefinition} from 'in-sdk/metrics/metricDefinitions';
import addSection from 'in-components/eventView/hocs/addSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {always, alwaysNull} from 'in-services/fixedStreams';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/EventChart.less';


// Our current chart implementation can't handle dynamic windowSizes (dynamic = 1change/sec)
// If an event is open, we will subscribe to live metrics which couses in mocing timewindows
// To avoid that the cahrt will run out of scope we add an offset to the windowSize
const chartOffset = 5 * 60 * 1000; // 5 min
const block = 'in-event-detail-chart';

export default addSection(connectTo(props => {
  return {
    to: (props.event.get('state') === 'closed')
      ? always(props.event.get('end'))
      : alwaysNull
  };
},
function EventChart({to, event}) {
  const triggeringMetrics = event.getIn(['metadata', 'metrics'], emptyList);
  return (
    <div className={block}>
      {triggeringMetrics.map(metric => {
        const metricName = metric.get('metricName');
        const from = event.getIn(['metadata', 'triggeringTime'], event.get('start'));
        const timeframe = {
          to,
          windowSize: event.get('end') - from
        };

        if (event.get('state') === 'open') {
          timeframe.windowSize += chartOffset;
        }

        return (
          <Chart key={metricName}
                 metric={metricName}
                 snapshotId={metric.get('snapshotId')}
                 timeframe$={always(timeframe)} />
        );
      }
      )}
    </div>
  );
}),
isVisible
);

const Chart = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId)
  };
},
function Chart({timeframe$, snapshot, snapshotId, metric}) {
  if (!snapshot) {
    return (
      <LoadingIndicator inline={true}
                               type='dark'
                               style={{ height: '16px' }} />
    );
  }

  const chartConfig = getMetricDefinition(snapshot.get('plugin'), metric);
  console.log(chartConfig);
  const m = chartConfig.getMetric(metric);
  return (
    <ChartWithLegend snapshotId={snapshotId}
                     timeframe$={timeframe$}
                     margins={{
                       left: 80
                     }}
                     y1={{
                       min: chartConfig.getMin(snapshot),
                       max: chartConfig.getMax(snapshot),
                       metrics: [
                         m
                       ],
                       labels: [
                         chartConfig.getLabel(snapshot, m)
                       ],
                       type: 'line',
                       formatter: chartConfig.formatter.detailed,
                       tooltipFormatter: chartConfig.formatter.compact
                     }} />
  );
});

function isVisible(event) {
  return event && event.getIn(['metadata', 'metrics'], emptyList).size > 0;
}
