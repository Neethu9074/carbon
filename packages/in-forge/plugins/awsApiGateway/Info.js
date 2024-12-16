/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('api_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('api_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsApiGateway.infoTitle.protocol')}>
        {data.get('api_protocol')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsApiGateway.infoTitle.endpointType')}>
        {data.get('api_endpoint_type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsApiGateway.infoTitle.createdAt')}>
        {formatDateTime(data.get('api_created_at'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
