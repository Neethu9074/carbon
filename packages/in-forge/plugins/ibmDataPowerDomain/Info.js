/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerDomain.domainName')}>
        {data.get('domainName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerDomain.quiesceState')}>
        {data.get('quiesceState')}
      </DescriptionItem>
    </DescriptionList>
  );
}
