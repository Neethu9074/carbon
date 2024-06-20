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
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.serverName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.serverId')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.groupName')}>{data.get('grpName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.groupNo')}>{data.get('grpNo')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoServer.lmid')}>{data.get('lmid')}</DescriptionItem>
    </DescriptionList>
  );
}
