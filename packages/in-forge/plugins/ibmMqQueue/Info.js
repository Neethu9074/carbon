/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

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
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.lastPutDateTime')}>
        {data.get('lastPutDateTime')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.lastGetDateTime')}>
        {data.get('lastGetDateTime')}
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
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.triggerType')}>{data.get('triggerType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.triggerControl')}>
        {data.get('triggerControl')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.monitoring')}>
        {data.get('queueMonitoring')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.queueDepthHighLimit')}>
        {data.get('queueDepthHighLimit')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.queueDepthLowLimit')}>
        {data.get('queueDepthLowLimit')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.queueServiceInterval')}>
        {data.get('queueServiceInterval')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueue.queueDescription')}>
        {data.get('queueDescription')}
      </DescriptionItem>
    </DescriptionList>
  );
}
