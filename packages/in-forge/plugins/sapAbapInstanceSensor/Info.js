/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.sapAbapInstanceSensor.instanceName')}>
        {data.get('serviceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapAbapInstanceSensor.hostName')}>
        {data.get('hostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapAbapInstanceSensor.sapVersion')}>
        {data.get('version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
