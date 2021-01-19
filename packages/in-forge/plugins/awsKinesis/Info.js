/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Stream name">{data.get('kns_stream_name')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('kns_stream_arn')}</DescriptionItem>
      <DescriptionItem title="Stream status">{data.get('kns_stream_status')}</DescriptionItem>
      <DescriptionItem title="Encryption type">{data.get('kns_encryption_type')}</DescriptionItem>
      <DescriptionItem title="Retention period hours">{data.get('kns_retention_period_hours')}</DescriptionItem>
      <DescriptionItem title="Created at">{formatDateTime(data.get('kns_stream_created_at'))}</DescriptionItem>
      <DescriptionItem title="Grouping Zone">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
