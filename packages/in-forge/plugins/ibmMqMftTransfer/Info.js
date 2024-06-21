/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.transferID')}>
        {data.get('transferID')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.startedTime')}>
        {data.get('startedTime')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.sourceAgent')}>
        {data.get('sourceAgent')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.destinationAgent')}>
        {data.get('destinationAgent')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.originator')}>
        {data.get('originatorUserID') + '@' + data.get('originatorHostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftTransfer.dashboard.actionStatus')}>
        {data.get('actionStatus')}
      </DescriptionItem>
    </DescriptionList>
  );
}
