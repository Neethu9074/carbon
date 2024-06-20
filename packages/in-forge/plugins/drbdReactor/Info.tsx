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
      <DescriptionItem title={t('in-forge:plugins.drbdReactor.drbdReactor')}>{data.get('drbdReactor')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdReactor.drbdHost')}>{data.get('drbdHost')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdReactor.utilsVersion')}>
        {data.get('utilsVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdReactor.kmodVersion')}>{data.get('kmodVersion')}</DescriptionItem>
    </DescriptionList>
  );
}
