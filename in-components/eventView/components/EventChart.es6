import React from 'react';

import addSection from 'in-components/eventView/hocs/addSection';
import {twoDecimalPlaces} from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {emptyList} from 'in-services/fixedImmutables';
import {always} from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import {to$} from 'in-stores/timeline';

import 'in-components/eventView/components/EventChart.less';


const block = 'in-event-detail-chart';

export default addSection(connectTo(props => {
  return {
    to: props.event.get('end') ? always(props.event.get('end')) : to$
  };
},
function EventChart({to, event}) {
  if (!to) {
    return (
      <LoadingIndicator inline={true}
                        type='dark'
                        style={{ height: '16px' }} />
    );
  }

  const triggeringMetrics = event.getIn(['metadata', 'cs'], emptyList);
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
          windowSize: to - from
        };

        return (
          <ChartWithLegend key={metricName}
                           snapshotId={metric.get('snapshotId')}
                           timeframe={timeframe}
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
    return event.getIn(['metadata', 'cs'], emptyList).size > 0;
  }
);
