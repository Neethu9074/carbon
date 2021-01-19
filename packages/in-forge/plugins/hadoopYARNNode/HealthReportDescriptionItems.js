/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { formatDateTime } from 'in-services/formatters/date';

export default connectTo(
  props => {
    return {
      healthy: getRawPayload(props.snapshot.get('id'), 'healthy'),
      timeOfLastHealthReport: getRawPayload(props.snapshot.get('id'), 'timeOfLastHealthReport')
    };
  },
  function HealthcheckResultDescriptionItem({ healthy, timeOfLastHealthReport }) {
    if (healthy == null) {
      return null;
    }

    return (
      <div>
        <DescriptionItem title="Hadoop health check result">{healthy ? 'Healthy' : 'Unhealthy'}</DescriptionItem>
        <DescriptionItem title="Last Hadoop health check">{formatDateTime(timeOfLastHealthReport)}</DescriptionItem>
      </div>
    );
  }
);
