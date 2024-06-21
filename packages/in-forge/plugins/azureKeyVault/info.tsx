/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoProvisioningState')}>
          {data.get('provisioningState')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoTier')}>{data.get('tier')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureKeyVault.infoType')}>{data.get('type')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
