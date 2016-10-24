import React from 'react';

import addSection from 'in-components/eventView/hocs/addSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {emptyArray} from 'in-services/fixedObjects';
import {always} from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import {to$} from 'in-stores/timeline';


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

  const triggeringMetrics = event.getIn(['metadata', 'metrics'], emptyArray);
  if (triggeringMetrics.length === 0) {
    return null;
  }

  return (
    <div>
      {triggeringMetrics.map(metric => {
        const snapshotId = metric.get('snapshotId');
        const metricName = metric.get('metric');
        const start = metric.get('start');

        return (
          <div>
            `${snapshotId} - ${metricName} - ${start} - ${to}`
          </div>
        );
      }
      )}
    </div>
  );
}),
  event => event.getIn(['metadata', 'metrics'], emptyArray).length > 0
);
