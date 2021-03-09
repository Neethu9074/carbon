/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function PythonInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.name')}>
        {data.get('snapshot.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.flavor')}>
        {data.get('snapshot.f')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.runtimeVersion')}>
        {data.get('snapshot.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.architecture')}>
        {data.get('snapshot.a')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.framework')}>
        {data.get('snapshot.fw')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.activationMethod')}>
        {data.get('snapshot.m')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.pythonRuntimePlatform.instanaPackageVersion')}>
        {data.get('snapshot.iv')}
      </DescriptionItem>
    </DescriptionList>
  );
}
