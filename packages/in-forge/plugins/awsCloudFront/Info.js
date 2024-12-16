/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('distribution_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>
        {data.get('distribution_domain_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsCloudFront.infoTitle.distributionId')}>
        {data.get('distribution_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsCloudFront.infoTitle.distributionStatus')}>
        {data.get('distribution_status')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsCloudFront.infoTitle.distributionLastModifiedTime')}>
        {formatDateTime(data.get('distribution_last_modified_time'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
