/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleStreamName')}>
        {data.get('kns_stream_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleARN')}>{data.get('kns_stream_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleStreamStatus')}>
        {data.get('kns_stream_status')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleEncryptionType')}>
        {data.get('kns_encryption_type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleRetentionPeriodHours')}>
        {data.get('kns_retention_period_hours')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleCreatedAt')}>
        {formatDateTime(data.get('kns_stream_created_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsKinesis.titleGroupingZone')}>
        {data.get('aws_grouping_zone')}
      </DescriptionItem>
    </DescriptionList>
  );
}
