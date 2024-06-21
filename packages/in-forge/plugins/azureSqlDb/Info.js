/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoLocation')}>{data.get('location')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoMaximumSize')}>
          {bytesTwoDecimalPlaces(data.get('maxSizeBytes'))}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoStatus')}>{data.get('status')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoZoneRedundant')}>
          {data.get('zoneRedundant') ? 'Yes' : 'No'}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlDb.infoSKU')}>{data.get('sku')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
