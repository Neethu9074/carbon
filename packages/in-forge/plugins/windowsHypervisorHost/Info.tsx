/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-windowshypervisor:dashboards.macAddress')}>
        {data.get('macAddress')}
      </DescriptionItem>
      <DescriptionItem title={t('in-windowshypervisor:dashboards.upTime')}>{data.get('upTime')}</DescriptionItem>
      <DescriptionItem title={t('in-windowshypervisor:dashboards.ipAddress')}>{data.get('address')}</DescriptionItem>
      <DescriptionItem title={t('in-windowshypervisor:noOfVms')}>{data.get('noOfVms')}</DescriptionItem>
    </DescriptionList>
  );
}
