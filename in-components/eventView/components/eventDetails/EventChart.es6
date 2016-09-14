import React from 'react';

import {twoDecimalPlaces} from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './EventChart.less';


const block = 'in-event-details-chart';

export default connectTo({
  timeframe: timeframe$
},
function EventChart({timeframe, event}) {
  if (!timeframe) {
    return (
      <LoadingIndicator inline={true}
                               type='dark'
                               style={{
                                 height: '16px'
                               }} />
    );
  }

  return (
    <div className={block}>
      <ChartWithLegend snapshotId={event.get('snapshotId')}
                       timeframe={timeframe}
                       margins={{
                         left: 0
                       }}
                       y1={{
                         min: 0,
                         max: 1,
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'awesome_metric'
                         ],
                         labels: [
                           'Awesome metric'
                         ],
                         type: 'line'
                       }}/>
    </div>
  );
});
