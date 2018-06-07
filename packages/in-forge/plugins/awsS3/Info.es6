import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Bucket">{data.get('s3_bucket_name')}</DescriptionItem>
      <DescriptionItem title="Bucket Owner">{data.get('s3_bucket_name')}</DescriptionItem>
      <DescriptionItem title="Bucket Name">{data.get('s3_bucket_owner_name')}</DescriptionItem>
      <DescriptionItem title="Bucket Created at">{formatDateTime(data.get('s3_bucket_created_at'))}</DescriptionItem>
      <DescriptionItem title="Grouping Zone">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
