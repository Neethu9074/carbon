/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWProcess.processName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWProcess.appName')}>{data.get('appName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWProcess.appVersion')}>{data.get('appVer')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWProcess.moduleName')}>{data.get('moduleName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tibcoBWProcess.moduleVersion')}>{data.get('moduleVer')}</DescriptionItem>
    </DescriptionList>
  );
}
