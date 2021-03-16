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
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.name')}>{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.startedAt')}>
        {data.get('startDate')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.alternatedAt')}>
        {data.get('alternatedDate')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.platform')}>{data.get('platform')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.location')}>{data.get('location')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.description')}>
        {data.get('description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.commandLevel')}>
        {data.get('commandLevel')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.repo')}>{data.get('repository')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.maxHandles')}>
        {data.get('maxHandles')}
      </DescriptionItem>
    </DescriptionList>
  );
}
