/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.domino.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.installType')}>{data.get('InstallType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.kitType')}>{data.get('KitType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.faultRecoveryBuild')}>
        {data.get('FaultRecovery_Build')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.mailServer')}>{data.get('MailServer')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.serverKeyFileName')}>
        {data.get('ServerKeyFileName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.serverName')}>{data.get('ServerName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.domino.serverRestarted')}>
        {data.get('ServerRestarted')}
      </DescriptionItem>
    </DescriptionList>
  );
}
