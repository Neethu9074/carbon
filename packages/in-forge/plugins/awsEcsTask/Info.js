import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ARN">{data.get('taskArn')}</DescriptionItem>
      <DescriptionItem title="Cluster">{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title="Task Definition">{data.get('taskDefinition')}</DescriptionItem>
      <DescriptionItem title="Task Definition Version">{data.get('taskDefinitionVersion')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Desired Status">{data.get('desiredStatus')}</DescriptionItem>
      <DescriptionItem title="Known Status">{data.get('knownStatus')}</DescriptionItem>
      <DescriptionItem title="Pull Started">{data.get('pullStartedAt')}</DescriptionItem>
      <DescriptionItem title="Pull Stopped">{data.get('pullStoppedAt')}</DescriptionItem>
      <DescriptionItem title="CPU Limit">{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{data.get('limits.memory')}</DescriptionItem>
    </DescriptionList>
  );
}
