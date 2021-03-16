/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerAppliance.applianceName')}>
        {data.get('applianceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerAppliance.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerAppliance.workList')}>
        {data.get('workList')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerAppliance.quiescedDomains')}>
        {data.get('quiescedDomains')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerAppliance.inactiveObjects')}>
        {data.get('inactiveObjects')}
      </DescriptionItem>
    </DescriptionList>
  );
}
