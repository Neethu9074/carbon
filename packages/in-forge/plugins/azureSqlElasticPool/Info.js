/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoMaximumSize')}>
          {bytesTwoDecimalPlaces(data.get('maxSizeBytes'))}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoState')}>
          {data.get('state')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoZoneRedundant')}>
          {data.get('zoneRedundant') ? 'Yes' : 'No'}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlElasticPool.infoSKU')}>{data.get('sku')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
