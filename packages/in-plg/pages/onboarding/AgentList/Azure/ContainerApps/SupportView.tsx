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
  runtime: 'Go' | '.NET';
}

export const Documentations = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case 'Go':
      return (
        <Stack gap="small">
          <DocumentLink text={t('in-plg:agentDetails.azure.monitoringAzure')} href="https://ibm.biz/ms-azure-agent" />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.monitoringAzureContainerApps')}
            href="https://ibm.biz/azure-container-app-trace-go"
          />
        </Stack>
      );
    case '.NET':
      return (
        <Stack gap="small">
          <DocumentLink text={t('in-plg:agentDetails.azure.monitoringAzure')} href="https://ibm.biz/ms-azure-agent" />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.monitoringAzureContainerApps')}
            href="https://ibm.biz/azure-container-app-trace-dotnet"
          />
        </Stack>
      );
    default:
      return (
        <Stack gap="small">
          <DocumentLink text={t('in-plg:agentDetails.azure.monitoringAzure')} href="https://ibm.biz/ms-azure-agent" />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.monitoringAzureContainerApps')}
            href="https://ibm.biz/azure-container-app-trace-go"
          />
        </Stack>
      );
  }
};

export const Prerequisites = ({ runtime }: Runtime): JSX.Element => {
  switch (runtime) {
    case 'Go':
    case '.NET':
      return (
        <Stack gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      );
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
