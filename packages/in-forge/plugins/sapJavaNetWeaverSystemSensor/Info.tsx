/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.instanceName')}>
        {data.get('serviceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.hostName')}>
        {data.get('hostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.sapVersion')}>
        {data.get('version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
