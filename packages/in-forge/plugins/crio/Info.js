import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNow } from 'in-services/formatters/date';

export default function CrioInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
      <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
      <DescriptionItem title="Image">{data.get('image')}</DescriptionItem>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="IP">{data.get('ip')}</DescriptionItem>
      <DescriptionItem title="Created">
        {formatDateTime(data.get('created'))} ({fromNow(data.get('created'))})
      </DescriptionItem>
    </DescriptionList>
  );
}
