/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getLabel } from 'in-sdk/snapshot';
import { t } from 'in-i18n';

export default function HaskellInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.haskellRuntimePlatform.name')}>{getLabel(snapshot)}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.haskellRuntimePlatform.program')}>
        {data.get('programName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.haskellRuntimePlatform.executable')}>
        {data.get('executablePath')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.haskellRuntimePlatform.processId')}>
        {data.get('pid')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
