/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.azureFunction.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureFunction.infoType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureFunction.infoLocation')}>{data.get('location')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureFunction.infoSubscriptionID')}>{data.get('subscription')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureFunction.infoResourceGroup')}>{data.get('resourceGroup')}</DescriptionItem>
    </DescriptionList>
  );
}
