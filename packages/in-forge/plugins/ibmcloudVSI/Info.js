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
      <DescriptionItem title={t('in-forge:plugins.ibmcloudVSI.kind')}>{data.get('kind')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmcloudVSI.instanceName')}>
        {data.get('instance_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmcloudVSI.generationId')}>
        {data.get('generation_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmcloudVSI.cpuCount')}>{data.get('count')}</DescriptionItem>
    </DescriptionList>
  );
}
