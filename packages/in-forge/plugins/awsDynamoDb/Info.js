/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsDynamoDb.titleTableName')}>
        {data.get('dyndb_table_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleARN')}>{data.get('dyndb_table_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleStatus')}>{data.get('dyndb_table_status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDynamoDb.titleItemCount')}>
        {data.get('dyndb_table_item_count')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDynamoDb.titleCreatedAt')}>
        {formatDateTime(data.get('dyndb_table_created_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleSize')}>
        {bytesZeroDecimalPlaces(data.get('dyndb_table_size_bytes'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDynamoDb.titleStreamARN')}>
        {data.get('dyndb_table_stream_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsDynamoDb.titleStreamLabel')}>
        {data.get('dyndb_table_stream_label')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
