/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoVersion')}>
          {data.get('redisVersion')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoHostName')}>
          {data.get('hostName')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoPort')}>
          {' '}
          {data.get('port')} {data.get('enableNonSslPort') ? '(Enabled)' : '(Disabled)'}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoSSLPort')}>
          {data.get('sslPort')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoSKU')}>{data.get('sku')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoMaxClients')}>
          {data.get('maxClients')}
        </DescriptionItem>
        {data.get('maxmemoryReserved') != 0 && (
          <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoMaxMemory')}>
            {bytesTwoDecimalPlaces(data.get('maxmemoryReserved'))}
          </DescriptionItem>
        )}
        {data.get('maxFragmentationmemoryReserved') != 0 && (
          <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoMaxFragmentationMemory')}>
            {bytesTwoDecimalPlaces(data.get('maxFragmentationmemoryReserved'))}
          </DescriptionItem>
        )}

        {data.get('maxmemoryDelta') != 0 && (
          <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoMemoryDelta')}>
            {bytesTwoDecimalPlaces(data.get('maxmemoryDelta'))}
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoStaticIP')}>
          {data.get('staticIP')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoSubnetID')}>
          {data.get('subnetId')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoClusterEnabled')}>
          {data.get('shardCount') > 0 ? 'Yes' : 'No'}
        </DescriptionItem>
        {data.get('shardCount') > 0 && (
          <DescriptionItem title={t('in-forge:plugins.azureRedisCache.infoShardCount')}>
            {data.get('shardCount')}
          </DescriptionItem>
        )}
      </DescriptionList>
    </div>
  );
}
