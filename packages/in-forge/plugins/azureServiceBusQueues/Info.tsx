/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureServiceBus.infoName')}>
          {snapshot.getIn(['data', 'name'])}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureServiceBus.infoResourceGroup')}>
          {snapshot.getIn(['data', 'resourceGroup'])}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureServiceBus.dashboard.titleStatus')}>
          {snapshot.getIn(['data', 'status'])}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureServiceBus.dashboard.titleMaxSize')}>
          {' '}
          {snapshot.getIn(['data', 'maxSizeInMegabytes'])}{' '}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
