import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { getRuntimeByKey } from 'in-sdk/snapshot/runtimes';

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
      <DescriptionItem title="Task Definition Name">{data.get('taskDefinition')}</DescriptionItem>
      <DescriptionItem title="Task Definition Version">{data.get('taskDefinitionVersion')}</DescriptionItem>
      <DescriptionItem title="Cluster ARN">{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title="Desired Status">{data.get('desiredStatus')}</DescriptionItem>
      <DescriptionItem title="Known Status">{data.get('knownStatus')}</DescriptionItem>
      <DescriptionItem title="CPU Limit">{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{data.get('limits.memory')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem title="Created At" dateTime={data.get('createdAt')} />
      <DateTimeWithPeriodSinceDescriptionItem title="Started At" dateTime={data.get('startedAt')} />
      <DescriptionItem title="Region">{data.get('region')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('type')}</DescriptionItem>
    </DescriptionList>
  );
}
