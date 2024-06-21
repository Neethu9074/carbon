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
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.queueId')}>{data.get('queueId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.lmid')}>{data.get('lmid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.senderPID')}>{data.get('senderPID')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.receiverPID')}>
        {data.get('receiverPID')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.senderServer')}>
        {data.get('senderSrv')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.tuxedoIpcQueue.receiverServer')}>
        {data.get('receiverSrv')}
      </DescriptionItem>
    </DescriptionList>
  );
}
