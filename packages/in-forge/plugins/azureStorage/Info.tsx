/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoRegion')}>{data.get('region')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoKind')}>{data.get('kind')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoState')}>
          {data.get('provisioningState')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoAccessTier')}>
          {data.get('accessTier')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureStorage.infoBlobCapabilities')}>
          {data.get('blobCapabilities')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
