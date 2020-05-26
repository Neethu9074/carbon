import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { getRuntimeByKey } from 'in-forge/plugins/awsEcsContainer/runtimes';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('containerName')}</DescriptionItem>
      <DescriptionItem title="Runtime">{getRuntimeByKey(data.get('runtime')).label}</DescriptionItem>
      <DescriptionItem title="Docker ID">{data.get('dockerId')}</DescriptionItem>
      <DescriptionItem title="Docker Name">{data.get('dockerName')}</DescriptionItem>
      <DescriptionItem title="Container Name">{data.get('containerName')}</DescriptionItem>
      <DescriptionItem title="Image">{data.get('image')}</DescriptionItem>
      <DescriptionItem title="Image ID">{data.get('imageId')}</DescriptionItem>
      <DescriptionItem title="Task ARN">{data.get('taskArn')}</DescriptionItem>
      <DescriptionItem title="Task Definition">{data.get('taskDefinition')}</DescriptionItem>
      <DescriptionItem title="Task Definition Version">{data.get('taskDefinitionVersion')}</DescriptionItem>
      <DescriptionItem title="Cluster ARN">{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title="Desired Status">{data.get('desiredStatus')}</DescriptionItem>
      <DescriptionItem title="Known Status">{data.get('knownStatus')}</DescriptionItem>
      <DescriptionItem title="CPU Limit">{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{data.get('limits.memory')}</DescriptionItem>
      <DescriptionItem title="Created At">{data.get('createdAt')}</DescriptionItem>
      <DescriptionItem title="Started At">{data.get('startedAt')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
    </DescriptionList>
  );
}
