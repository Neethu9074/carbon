/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function IBMVSIInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.iBMVSI.labelInstanceName')}>
        {data.get('instance_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.iBMVSI.labelGenerationId')}>
        {data.get('generation_id') == '2' ? 'Virtual Private Cloud' : 'Classic'}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.iBMVSI.labelCpuCount')}>{data.get('cpuCount')}</DescriptionItem>
    </DescriptionList>
  );
}
