/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function CLRInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.clrRuntimePlatform.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clrRuntimePlatform.infoCLRVersion')}>
        {data.get('runtimeVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clrRuntimePlatform.infoArguments')}>
        {data.get('arguments')}
      </DescriptionItem>
    </DescriptionList>
  );
}
