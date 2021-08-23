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
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.instanceId')}>
        {data.get('InstanceId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.instanceName')}>
        {data.get('InstanceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.topic')}>{data.get('Topic')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.messageType')}>
        {t('in-forge:plugins.aliCloudRocketMq.messageType', { context: String(data.get('MessageType')) })}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.relation')}>
        {t('in-forge:plugins.aliCloudRocketMq.relation', { context: String(data.get('Relation')) })}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.topicOwner')}>
        {data.get('Owner')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.topicRemark')}>
        {data.get('Remark')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudRocketMqTopic.topicCreateTime')}>
        {formatDateTime(data.get('CreateTime'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
