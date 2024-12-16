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
      <DescriptionItem title={t('in-forge:plugins.titleARN')}>{data.get('load_balancer_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsElb.titleDNSName')}>{data.get('dns_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleStatus')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleScheme')}>{data.get('scheme')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsElb.titleCreationTime')}>
        {formatDateTime(data.get('created_time'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsElb.titleHostedZone')}>
        {data.get('canonical_hosted_zone_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleVPC')}>{data.get('vpc_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsElb.titleIpAddressType')}>
        {data.get('ip_address_type')}
      </DescriptionItem>
    </DescriptionList>
  );
}
