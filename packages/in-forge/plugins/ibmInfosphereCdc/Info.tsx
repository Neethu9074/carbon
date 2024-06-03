/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList/DescriptionList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function IbmInfosphereCdcInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdc.host')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmInfosphereCdc.port')}>{data.get('port')}</DescriptionItem>
    </DescriptionList>
  );
}
