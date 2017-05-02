import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';
import { getMetricForFocusedMoment } from 'in-stores/metric';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      status: getMetricForFocusedMoment({
        snapshotId: props.snapshotId,
        metric: 'healthcheckResult'
      }).map(v => v[1])
    };
  },
  function HealthcheckResultDescriptionItem({ status }) {
    if (status == null || status === -1) {
      return null;
    }

    return (
      <DescriptionItem title="Health check result">
        {status ? 'Healthy' : 'Unhealthy'}
      </DescriptionItem>
    );
  }
);
