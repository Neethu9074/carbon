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
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.hostName')}>
        {data.get('agentDeclaredHostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.agentType')}>
        {data.get('agentType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.agentTimeZone')}>
        {data.get('agentTimeZone')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.AgentStartTimeUTC')}>
        {data.get('AgentStartTimeUTC')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.agentVersion')}>
        {data.get('agentVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.agentOsName')}>
        {data.get('agentOsName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.maxSourceTransfers')}>
        {data.get('maxSourceTransfers')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.maxDestinationTransfers')}>
        {data.get('maxDestinationTransfers')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftAgent.dashboard.maxQueuedTransfers')}>
        {data.get('maxQueuedTransfers')}
      </DescriptionItem>
    </DescriptionList>
  );
}
