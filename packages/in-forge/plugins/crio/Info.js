/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function CrioInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
      <DescriptionItem title="Image">{data.get('image')}</DescriptionItem>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="IP">{data.get('ip')}</DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem title="Created At" dateTime={data.get('created')} />
    </DescriptionList>
  );
}
