/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function IbmApiConnectInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.hostName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.nodeId')}>{data.get('nodeId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.luaVersion')}>
        {data.get('luaVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.kongVersion')}>
        {data.get('kongVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.role')}>{data.get('role')}</DescriptionItem>
    </DescriptionList>
  );
}
