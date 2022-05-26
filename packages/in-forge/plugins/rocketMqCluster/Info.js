/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMq.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMq.instanceId')}>
        {data.get('InstanceId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMq.instanceName')}>
        {data.get('InstanceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMq.instanceType')}>
        {t('in-forge:plugins.aliCloudRocketMq.instanceType', { context: String(data.get('InstanceType')) })}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMq.instanceStatus')}>
        {t('in-forge:plugins.aliCloudRocketMq.instanceStatus', { context: String(data.get('InstanceStatus')) })}
      </DescriptionItem>
    </DescriptionList>
  );
}
