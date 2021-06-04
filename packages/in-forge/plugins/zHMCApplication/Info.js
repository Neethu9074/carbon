/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function zHMCInfo({ snapshot }) {
  const data = snapshot.get('data');
  const cpc = data.get('cpc');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.zHMCApplication.plugin')}>{data.get('hostname')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zHMCApplication.cpcName')}>{cpc.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zHMCApplication.cpcId')}>{cpc.get('cpcId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zHMCApplication.dpmEnabled')}>
        {cpc.get('dpmEnabled')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zHMCApplication.noOfPartitions')}>
        {cpc.get('noOfPartitions')}
      </DescriptionItem>
    </DescriptionList>
  );
}
