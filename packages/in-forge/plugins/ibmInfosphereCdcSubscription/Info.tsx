/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function IbmInfosphereSubscriptionInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdcSubscription.subscriptionName')}>
        {data.get('name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceDatastore')}>
        {data.get('source')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetDataStore')}>
        {data.get('target')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdcSubscription.state')}>
        {data.get('state')}
      </DescriptionItem>
    </DescriptionList>
  );
}
