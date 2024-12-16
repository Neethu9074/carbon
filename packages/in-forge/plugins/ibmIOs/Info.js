/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function IbmIOsInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.hostName')}>{data.get('hostName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.osVersion')}>{data.get('osVersion')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.totalCPU')}>{data.get('totalCPU')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.totalMemory')}>
        {data.get('totalMemory')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.configuredCPU')}>
        {data.get('configuredCPU')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.configuredMemory')}>
        {data.get('configuredMemory')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.partitionId')}>
        {data.get('partitionId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.numberOfPartitions')}>
        {data.get('numberOfPartitions')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.restrictedState')}>
        {data.get('restrictedState')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
