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
      <DescriptionItem title={t('in-forge:plugins.drbdResource.resourceName')}>
        {data.get('resourceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdResource.resourceRole')}>
        {data.get('resourceRole')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.drbdResource.drbdHost')}>{data.get('drbdHost')}</DescriptionItem>
    </DescriptionList>
  );
}
