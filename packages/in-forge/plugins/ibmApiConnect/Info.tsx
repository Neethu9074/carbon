/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function IbmApiConnectInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmApiConnect.orgName')}>{data.get('orgName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmApiConnect.apicVersion')}>{data.get('version')}</DescriptionItem>
    </DescriptionList>
  );
}
