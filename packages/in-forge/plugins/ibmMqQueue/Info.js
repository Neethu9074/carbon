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
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.name')}>{data.get('queueName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.type')}>{data.get('queueType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.createdAt')}>{data.get('queueCreated')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.alternatedAt')}>
        {data.get('queueAlternated')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.inhibitPut')}>{data.get('inhibitPut')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.inhibitGet')}>{data.get('inhibitGet')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.deliverySequence')}>
        {data.get('queueDelivery')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.defaultBinding')}>
        {data.get('queueDefaultBinding')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.usage')}>{data.get('queueUsage')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.monitoring')}>
        {data.get('queueMonitoring')}
      </DescriptionItem>
    </DescriptionList>
  );
}
