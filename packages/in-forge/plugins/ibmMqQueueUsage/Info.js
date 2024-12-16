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
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.name')}>{data.get('queueName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.application')}>
        {data.get('application')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.channel')}>{data.get('channel')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.connection')}>
        {data.get('connection')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.inputType')}>{data.get('inputType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.output')}>{data.get('output')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.inquire')}>{data.get('inquire')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.set')}>{data.get('set')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.browse')}>{data.get('browse')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.lastMessageAt')}>
        {data.get('lastMessageAt')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.handleState')}>
        {data.get('handleState')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqQueueUsage.user')}>{data.get('user')}</DescriptionItem>
    </DescriptionList>
  );
}
