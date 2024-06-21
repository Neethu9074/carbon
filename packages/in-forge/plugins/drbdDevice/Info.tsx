/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.deviceName')}>{data.get('deviceName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.volume')}>{data.get('volume')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.minor')}>{data.get('minor')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.drbdHost')}>{data.get('drbdHost')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.resourceName')}>
        {data.get('resourceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdDevice.deviceState')}>{data.get('deviceState')}</DescriptionItem>
    </DescriptionList>
  );
}
