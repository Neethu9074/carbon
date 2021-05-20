/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function IbmCloudFunctionsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudFunctions.labelZone')}>{data.get('zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudFunctions.labelPackageCount')}>
        {data.get('packages', emptyList).size}
      </DescriptionItem>
    </DescriptionList>
  );
}
