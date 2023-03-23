/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.abapSystem.hostName')}>{data.get('hostName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.abapSystem.resourceType')}>
        {'resourceType'}
        {data.get('resourceType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.abapSystem.host_id')}>{data.get('host_id')}</DescriptionItem>
    </DescriptionList>
  );
}
