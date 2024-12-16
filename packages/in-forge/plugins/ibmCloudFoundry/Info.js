/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function IbmCloudFoundryInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudFoundry.appName')}>{data.get('appName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudFoundry.zone')}>{data.get('zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudFoundry.instanceCount')}>
        {data.get('instanceCount')}
      </DescriptionItem>
    </DescriptionList>
  );
}
