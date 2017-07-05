import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Version">
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title="Node ID">
        {data.get('nodeId')}
      </DescriptionItem>
      <DescriptionItem title="Hadoop Health Check Status">
        {formatHealthStatus(data.get('healthy'))}
      </DescriptionItem>
      <DescriptionItem title="Hadoop Health Check Occurred At">
        {formatDateTime(data.get('timeOfLastHealthReport'))}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}

function formatHealthStatus(healthy) {
  return healthy ? 'Healthy' : 'Not Healthy';
}
