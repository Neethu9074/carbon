/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const role = data.get('slave') ? 'Slave' : 'Master';

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Broker Name">{data.get('brokerName')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Health Status">{data.get('healthStatus')}</DescriptionItem>
      <DescriptionItem title="Ports">
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title="Role">{role}</DescriptionItem>
      <DescriptionItem title="Memory Limit">{bytesTwoDecimalPlaces(data.get('memoryLimit'))}</DescriptionItem>
      <DescriptionItem title="Store Limit">{bytesTwoDecimalPlaces(data.get('storeLimit'))}</DescriptionItem>
      <DescriptionItem title="Topics Count">{data.get('topicNames', emptyList).size}</DescriptionItem>
      <DescriptionItem title="Queues Count">{data.get('queueNames', emptyList).size}</DescriptionItem>
      <DescriptionItem title="DL Queues Count">{data.get('dlqueueNames', emptyList).size}</DescriptionItem>
    </DescriptionList>
  );
}
