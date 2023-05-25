/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

interface KongInfoProps {
  snapshot: SnapshotData;
}
interface SnapshotData {
  data: KongSnapshot;
}
interface KongSnapshot {
  hostName: string;
  nodeId: string;
  luaVersion: string;
  kongVersion: string;
}

export default function KongInfo({ snapshot: { data: kong } }: KongInfoProps): JSX.Element {
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.hostName')}>{kong.hostName}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.nodeId')}>{kong.nodeId}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.luaVersion')}>{kong.luaVersion}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.kongVersion')}>{kong.kongVersion}</DescriptionItem>
    </DescriptionList>
  );
}
