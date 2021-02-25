/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsMq.arn')}>{data.get('broker_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.brokerName')}>{data.get('broker_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.state')}>{data.get('broker_state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.createdAt')}>
        {formatDateTime(data.get('created_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.engineType')}>{data.get('engine_type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.engineVersion')}>{data.get('engine_version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.instanceType')}>{data.get('instance_type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.deployment')}>{data.get('deployment')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.publicAccessibility')}>
        {yesOrNo(data.get('public_accessibility'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMq.region')}>{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
