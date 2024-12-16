/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export const NOT_AVAILABLE = 'Not Available';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  const metastore = data.get('unityCatalog.metastore');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoResourceGroup')}>
        {data.get('resourceGroup')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoLocation')}>
        {data.get('location')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoSubscriptionID')}>
        {data.get('subscription')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoType')}>{data.get('type')}</DescriptionItem>
      {metastore != NOT_AVAILABLE && (
        <DescriptionItem title={t('in-forge:plugins.azureDatabricks.infoMetastore')}>{metastore}</DescriptionItem>
      )}
    </DescriptionList>
  );
}
