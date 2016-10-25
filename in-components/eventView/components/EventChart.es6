import React from 'react';

import addSection from 'in-components/eventView/hocs/addSection';
import {twoDecimalPlaces} from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {always, alwaysNull} from 'in-services/fixedStreams';
import {emptyList} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/EventChart.less';


// Our current chart implementation can't handle dynamic windowSizes (dynamic = 1change/sec)
// If an event is open, we will subscribe to live metrics which couses in mocing timewindows
// To avoid that the cahrt will run out of scope we add an offset to the windowSize
const chartOffset = 10 * 1000; // 10 min
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
  if (triggeringMetrics.size === 0) {
    return null;
  }

  return (
    <div className={block}>
      {triggeringMetrics.map(metric => {
        const metricName = metric.get('metricName');
        const from = event.get('start');
        const timeframe = {
          to,
          windowSize: event.get('end') - from
        };

        if (event.get('state') === 'opemn') {
          timeframe.windowSize += chartOffset;
        }

        return (
          <ChartWithLegend key={metricName}
                           snapshotId={metric.get('snapshotId')}
                           timeframe$={always(timeframe)}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               metricName
                             ],
                             labels: [
                               metricName
                             ],
                             type: 'line',
                             formatter: twoDecimalPlaces
                           }} />
        );
      }
      )}
    </div>
  );
}),
  event => {
    return event.getIn(['metadata', 'metrics'], emptyList).size > 0;
  }
);
