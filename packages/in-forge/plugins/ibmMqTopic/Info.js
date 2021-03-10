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
      <DescriptionItem title={t('in-forge:plugins.ibmMqTopic.name')}>{data.get('topicName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqTopic.queueManager')}>{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqTopic.clusterName')}>{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqTopic.topicType')}>{data.get('topicType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqTopic.topicAlternatedAt')}>
        {data.get('topicAlternatedAt')}
      </DescriptionItem>
    </DescriptionList>
  );
}
