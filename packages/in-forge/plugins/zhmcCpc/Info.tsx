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
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.name')}>{data.get('name')}</DescriptionItem>
      {data.get('dpmEnabled') == 'true' ? (
        <DescriptionItem title={t('in-forge:plugins.zhmcCpc.mode')}>{'DPM'}</DescriptionItem>
      ) : (
        <DescriptionItem title={t('in-forge:plugins.zhmcCpc.mode')}>{'Classic'}</DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.consoleId')}>{data.get('consoleId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.cpcId')}>{data.get('cpcId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.numberOfPartitions')}>
        {data.get('noOfPartitions')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.numberOfAdapters')}>
        {data.get('noOfAdapters')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.ipAddress')}>{data.get('ipAddress')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.machineTypeModel')}>
        {data.get('machineTypeModel')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.machineSerial')}>{data.get('machineSerial')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zhmcCpc.status')}>{data.get('status')}</DescriptionItem>
    </DescriptionList>
  );
}
