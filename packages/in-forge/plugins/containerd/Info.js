import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime, fromNow } from 'in-services/formatters/date';

export default function ContainerdInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title="Id">{data.get('id')}</DescriptionItem>
      <DescriptionItem title="Image">{data.get('image')}</DescriptionItem>
      <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
      <DescriptionItem title="Created">
        {formatDateTime(data.get('createdAt'))} ({fromNow(data.get('createdAt'))})
      </DescriptionItem>
      <DescriptionItem title="Updated">
        {formatDateTime(data.get('updatedAt'))} ({fromNow(data.get('updatedAt'))})
      </DescriptionItem>
    </DescriptionList>
  );
}
