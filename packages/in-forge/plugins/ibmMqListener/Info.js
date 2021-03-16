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
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.name')}>{data.get('listenerName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.status')}>{data.get('listenerStatus')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.queueManager')}>{data.get('qmName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.ipAddress')}>
        {data.get('listenerIpAddress')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.port')}>{data.get('listenerPort')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqListener.startedAt')}>
        {data.get('listenerStartedAt')}
      </DescriptionItem>
    </DescriptionList>
  );
}
