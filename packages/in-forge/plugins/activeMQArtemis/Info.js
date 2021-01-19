/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function ActiveMQArtemisInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Broker Name">{data.get('brokerName')}</DescriptionItem>
      <DescriptionItem title="Node ID">{data.get('nodeId')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Ports">
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title="Memory Limit">{bytesTwoDecimalPlaces(data.get('memoryLimit'))}</DescriptionItem>
      <DescriptionItem title="Addresses">{data.get('addressNames', emptyList).size}</DescriptionItem>
      <DescriptionItem title="Queues">{data.get('queueNames', emptyList).size}</DescriptionItem>
    </DescriptionList>
  );
}
