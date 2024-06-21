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
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.azureBlob.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureBlob.infoType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureBlob.infoLocation')}>{data.get('location')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureBlob.infoSubscriptionID')}>
        {data.get('subscription')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureBlob.infoResourceGroup')}>
        {data.get('resourceGroup')}
      </DescriptionItem>
    </DescriptionList>
  );
}
