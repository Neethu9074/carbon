import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const createdAt = data.get('createTime');
  return (
    <DescriptionList>
      <DescriptionItem title="Project Name">{data.get('projectName')}</DescriptionItem>
      <DescriptionItem title="Project ID">{data.get('projectId')}</DescriptionItem>
      <DescriptionItem title="Project Number">{data.get('projectNumber')}</DescriptionItem>
      <DescriptionItem title="Created At">{formatDateTime(createdAt)}</DescriptionItem>
    </DescriptionList>
  );
}
