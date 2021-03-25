/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function IBMiDb2Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmiDB2Database.sidebar.hostName')}>
        {data.get('hostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmiDB2Database.sidebar.partitionId')}>
        {data.get('partitionId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmiDB2Database.sidebar.numberOfPartitions')}>
        {data.get('numberOfPartitions')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmiDB2Database.sidebar.restrictedState')}>
        {data.get('restrictedState')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
