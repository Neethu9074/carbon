/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoKind')}>{data.get('kind')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoState')}>
          {data.get('provisioningState')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureDataFactory.infoVersion')}>
          {data.get('version')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
