/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerCluster.deviceHost')}>
        {data.get('deviceHost')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerCluster.applianceName')}>
        {data.get('applianceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerCluster.clusterName')}>
        {data.get('clusterName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
