/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';

export default function DockerInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Image">{data.get('Image')}</DescriptionItem>
      <DescriptionItem title="Command">{data.get('Command')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem title="Created At" dateTime={data.get('Created')} />
      <DateTimeWithPeriodSinceDescriptionItem title="Started At" dateTime={data.get('Started')} />
      <DescriptionItem title="Id">{data.get('Id')}</DescriptionItem>
      <DescriptionItem title="Names">{data.get('Names', emptyList).join(', ')}</DescriptionItem>
      <DescriptionItem title="Network Mode">{data.get('NetworkMode')}</DescriptionItem>
      <DescriptionItem title="Storage Driver">{data.get('StorageDriver')}</DescriptionItem>
      <DescriptionItem title="Docker Version">{data.get('docker_version')}</DescriptionItem>
    </DescriptionList>
  );
}
