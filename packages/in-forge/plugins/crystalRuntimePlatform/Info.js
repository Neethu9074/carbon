/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function CrystalInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.crystalRuntimePlatform.crystalVersion')}>
        {data.get('crystal_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.crystalRuntimePlatform.runtimeArguments')}>
        {data.get('args', emptyArray).join(' ')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.crystalRuntimePlatform.processId')}>
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}
