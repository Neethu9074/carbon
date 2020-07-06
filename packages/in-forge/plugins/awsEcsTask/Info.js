import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNow } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data'),
    pullStartedAt = data.get('pullStartedAt'),
    pullStoppedAt = data.get('pullStoppedAt');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('taskArn')}</DescriptionItem>
      <DescriptionItem title="Cluster">{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title="Task Definition ARN">{data.get('taskDefinitionArn')}</DescriptionItem>
      <DescriptionItem title="Task Definition Name">{data.get('taskDefinition')}</DescriptionItem>
      <DescriptionItem title="Task Definition Version">{data.get('taskDefinitionVersion')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Availability Zone">{data.get('availabilityZone')}</DescriptionItem>
      <DescriptionItem title="Desired Status">{data.get('desiredStatus')}</DescriptionItem>
      <DescriptionItem title="Known Status">{data.get('knownStatus')}</DescriptionItem>
      <DescriptionItem title="Pull Started">
        {formatDateTime(pullStartedAt)} ({fromNow(pullStartedAt)})
      </DescriptionItem>
      <DescriptionItem title="Pull Stopped">
        {formatDateTime(pullStoppedAt)} ({fromNow(pullStoppedAt)})
      </DescriptionItem>
      <DescriptionItem title="CPU Limit">{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{data.get('limits.memory')}</DescriptionItem>
    </DescriptionList>
  );
}
