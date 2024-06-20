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
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoName')}>
          {data.get('name')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoType')}>
          {data.get('type')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMachineLearning.infoCreatedAt')}>
          {data.get('createdAt')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
