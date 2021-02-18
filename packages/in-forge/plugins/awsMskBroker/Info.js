/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const addedToClusterTime = data.get('addedToClusterTime');

  return (
    <DescriptionList>
      <DescriptionItem title="ID">{data.get('brokerId')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('nodeArn')}</DescriptionItem>
      <DescriptionItem title="Type">{data.get('nodeType')}</DescriptionItem>
      <DescriptionItem title="Instance type">{data.get('instanceType')}</DescriptionItem>
      <DescriptionItem title="Added to cluster">{formatDateTime(addedToClusterTime)}</DescriptionItem>
    </DescriptionList>
  );
}
