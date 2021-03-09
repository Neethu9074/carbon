/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function F5Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.f5.signature')}>{data.get('signature')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.f5.totalMemory')}>{snapshot.get('memTotal')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.f5.freeMemory')}>{data.get('memFree')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.f5.cpuUsage')}>{data.get('cpuUsed')}</DescriptionItem>
    </DescriptionList>
  );
}
