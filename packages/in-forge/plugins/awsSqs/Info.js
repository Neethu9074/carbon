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
      <DescriptionItem title={t('in-forge:plugins.awsSqs.endpoint')}>{data.get('endpoint_address')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.arn')}>{data.get('queue_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.region')}>{data.get('aws_region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.createdAt')}>
        {formatDateTime(data.get('created_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.messageRetentionPeriod')}>
        {data.get('msg_retention_period')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.maxMessageSize')}>{data.get('max_msg_size')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.visibilityTimeout')}>
        {data.get('visibilty_timeout')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSqs.lastModified')}>
        {formatDateTime(data.get('last_modified'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
