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
      <DescriptionItem title={t('in-forge:plugins.abapInstance.hostName')}>
        {data.get('metrics.ABAP_INSTANCE_AVAILABILITY.hostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.abapInstance.eventName')}>
        {data.get('metrics.ABAP_INSTANCE_AVAILABILITY.eventName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.abapInstance.category')}>
        {data.get('metrics.ABAP_INSTANCE_AVAILABILITY.category')}
      </DescriptionItem>
    </DescriptionList>
  );
}
