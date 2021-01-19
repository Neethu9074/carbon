/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function ContainerdInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Image">{data.get('image')}</DescriptionItem>
      <DescriptionItem title="Containerd namespace">{data.get('namespace')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem title="Created At" dateTime={data.get('createdAt')} />
      <DateTimeWithPeriodSinceDescriptionItem title="Updated At" dateTime={data.get('updatedAt')} />
    </DescriptionList>
  );
}
