/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.peerDeviceName')}>
        {data.get('peerDeviceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.volume')}>{data.get('volume')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.connectionName')}>
        {data.get('connectionName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.peerNodeId')}>{data.get('peerNodeId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.resourceName')}>{data.get('resourceName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeer.drbdHost')}>{data.get('drbdHost')}</DescriptionItem>
    </DescriptionList>
  );
}
