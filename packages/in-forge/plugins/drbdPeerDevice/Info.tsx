/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.peerDeviceName')}>
        {data.get('peerDeviceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.connectionName')}>
        {data.get('connectionName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.peerNodeId')}>
        {data.get('peerNodeId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.volume')}>{data.get('volume')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.drbdHost')}>{data.get('drbdHost')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdPeerDevice.resourceName')}>
        {data.get('resourceName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
