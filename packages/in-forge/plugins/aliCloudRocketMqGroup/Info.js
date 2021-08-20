/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.instanceId')}>
        {data.get('InstanceId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.instanceName')}>
        {data.get('InstanceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.groupId')}>
        {data.get('GroupId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.groupType')}>
        {data.get('GroupType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.groupOwner')}>
        {data.get('Owner')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.groupRemark')}>
        {data.get('Remark')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqGroup.groupCreateTime')}>
        {formatDateTime(data.get('CreateTime'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
