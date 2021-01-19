/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Table Name">{data.get('dyndb_table_name')}</DescriptionItem>
      <DescriptionItem title="ARN">{data.get('dyndb_table_arn')}</DescriptionItem>
      <DescriptionItem title="Status">{data.get('dyndb_table_status')}</DescriptionItem>
      <DescriptionItem title="Item Count">{data.get('dyndb_table_item_count')}</DescriptionItem>
      <DescriptionItem title="Created at">{formatDateTime(data.get('dyndb_table_created_at'))}</DescriptionItem>
      <DescriptionItem title="Size">{bytesZeroDecimalPlaces(data.get('dyndb_table_size_bytes'))}</DescriptionItem>
      <DescriptionItem title="Stream ARN">{data.get('dyndb_table_stream_arn')}</DescriptionItem>
      <DescriptionItem title="Stream Label">{data.get('dyndb_table_stream_label')}</DescriptionItem>
      <DescriptionItem title="Region">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
