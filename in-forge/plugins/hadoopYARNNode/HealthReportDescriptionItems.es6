import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';
import { getRawPayload } from 'in-stores/snapshot';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import { formatDateTime } from 'in-services/formatters/date';

export default connectTo(
  props => {
    return {
      healthy: getRawPayload(props.snapshot.get('id'), 'healthy'),
      timeOfLastHealthReport: getRawPayload(props.snapshot.get('id'), 'timeOfLastHealthReport'),
      timeframe: timeframe$
    };
  },
  function HealthcheckResultDescriptionItem({ healthy, timeOfLastHealthReport, timeframe }) {
    if (healthy == null || timeframe.to != null) {
      return null;
    }

    return (
      <div>
        <DescriptionItem title="Hadoop health check result">
          {healthy ? 'Healthy' : 'Unhealthy'}
        </DescriptionItem>
        <DescriptionItem title="Time of last hadoop health check">
          {formatDateTime(timeOfLastHealthReport)}
        </DescriptionItem>
      </div>
    );
  }
);
