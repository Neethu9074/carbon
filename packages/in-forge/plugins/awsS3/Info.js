/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Bucket">{data.get('s3_bucket_name')}</DescriptionItem>
      <DescriptionItem title="Bucket Owner">{data.get('s3_bucket_owner_name')}</DescriptionItem>
      <DescriptionItem title="Bucket Owner ID">{data.get('s3_bucket_owner_id')}</DescriptionItem>
      <DescriptionItem title="Bucket Created at">{formatDateTime(data.get('s3_bucket_created_at'))}</DescriptionItem>
      <DescriptionItem title="Bucket Public">{yesOrNo(data.get('s3_bucket_public'))}</DescriptionItem>
      <DescriptionItem title="Grouping Zone">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
