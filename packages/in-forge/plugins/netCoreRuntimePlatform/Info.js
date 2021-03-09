/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function NetCoreInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.netCoreRuntimePlatform.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.netCoreRuntimePlatform.runtimeVersion')}>
        {data.get('rv')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.netCoreRuntimePlatform.targetVersion')}>
        {data.get('tv')}
      </DescriptionItem>
    </DescriptionList>
  );
}
