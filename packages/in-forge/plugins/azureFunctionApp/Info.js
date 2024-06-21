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
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoResourceGroup')}>{data.get('resourceGroup')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoLocation')}>{data.get('location')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoSubscriptionID')}>{data.get('subscription')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoKind')}>{data.get('kind')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureFunctionApp.infoState')}>{data.get('state')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
