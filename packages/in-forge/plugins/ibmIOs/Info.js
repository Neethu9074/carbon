/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function IbmIOsInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmIOs.sidebar.hostName')}>{data.get('hostName')}</DescriptionItem>
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
