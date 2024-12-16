/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.azureQueue.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureQueue.infoType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureQueue.infoLocation')}>{data.get('location')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureQueue.infoSubscriptionID')}>
        {data.get('subscription')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureQueue.infoResourceGroup')}>
        {data.get('resourceGroup')}
      </DescriptionItem>
    </DescriptionList>
  );
}
