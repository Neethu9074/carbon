/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsS3.bucket')}>{data.get('s3_bucket_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsS3.bucketOwner')}>
        {data.get('s3_bucket_owner_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsS3.bucketOwnerId')}>
        {data.get('s3_bucket_owner_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsS3.bucketCreatedAt')}>
        {formatDateTime(data.get('s3_bucket_created_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsS3.bucketPublic')}>
        {yesOrNo(data.get('s3_bucket_public'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsS3.groupingZone')}>
        {data.get('aws_grouping_zone')}
      </DescriptionItem>
    </DescriptionList>
  );
}
