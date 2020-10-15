import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const createdAt = data.get('createTime');
  return (
    <DescriptionList>
      <DescriptionItem title="Name">{data.get('projectName')}</DescriptionItem>
      <DescriptionItem title="ID">{data.get('projectId')}</DescriptionItem>
      <DescriptionItem title="Number">{data.get('projectNumber')}</DescriptionItem>
      <DescriptionItem title="Created At">{formatDateTime(createdAt)}</DescriptionItem>
    </DescriptionList>
  );
}
