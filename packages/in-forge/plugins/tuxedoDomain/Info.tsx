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
      <DescriptionItem title={t('in-forge:plugins.tuxedoDomain.domainName')}>{data.get('domainName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoDomain.domainId')}>{data.get('domainId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoDomain.tuxconfig')}>{data.get('tuxconfig')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoDomain.ipckey')}>{data.get('ipckey')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoDomain.tuxdir')}>{data.get('tuxdir')}</DescriptionItem>
    </DescriptionList>
  );
}
