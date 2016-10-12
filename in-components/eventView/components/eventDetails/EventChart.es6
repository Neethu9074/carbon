import React from 'react';

import Separator from 'in-components/eventView/components/eventDetails/Seperator';
import {twoDecimalPlaces} from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';


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

  const triggeringMetric = event.get('triggeringMetric');
  if (!triggeringMetric) {
    return null;
  }

  return (
    <div>
      <Separator />
      <ChartWithLegend snapshotId={event.getIn(['problem', 'snapshotId'])}
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
