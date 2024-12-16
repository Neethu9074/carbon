/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

interface Runtime {
  runtime: 'Node.js' | '.NET'; // Allow both Node.js and .NET
}

export const Documentations = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case '.NET':
      return (
        <Stack gap="small">
          <DocumentLink text={t('in-plg:agentDetails.azure.monitoringAzure')} href="https://ibm.biz/ms-azure-agent" />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.dotnet.monitoringAppService')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=services-azure-app-service-tracing-net"
          />
        </Stack>
      );
    case 'Node.js':
    default:
      return (
        <Stack gap="small">
          <DocumentLink text={t('in-plg:agentDetails.azure.monitoringAzure')} href="https://ibm.biz/ms-azure-agent" />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.nodejs.monitoringAppService')}
            href="https://ibm.biz/azure-tracing-nodejs"
          />
        </Stack>
      );
  }
};

export const Prerequisites = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case 'Node.js':
    case '.NET':
    default:
      return (
        <Stack gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
  }
};
