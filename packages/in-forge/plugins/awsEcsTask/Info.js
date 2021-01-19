/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

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
      <DateTimeWithPeriodSinceDescriptionItem title="Pull Started" dateTime={data.get('pullStartedAt')} />
      <DateTimeWithPeriodSinceDescriptionItem title="Pull Stopped" dateTime={data.get('pullStoppedAt')} />
      <DescriptionItem title="CPU Limit">{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{data.get('limits.memory')}</DescriptionItem>
    </DescriptionList>
  );
}
