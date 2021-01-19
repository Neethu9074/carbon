/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { positiveNumber } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title="Ports">
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title="State">{data.get('state')}</DescriptionItem>
      <DescriptionItem title="Max Connections">{positiveNumber(data.get('maxConnections'))}</DescriptionItem>
      <DescriptionItem title="Topics">{data.get('topicNames', emptyList).size}</DescriptionItem>
      <DescriptionItem title="Queues">{data.get('queueNames', emptyList).size}</DescriptionItem>
    </DescriptionList>
  );
}
