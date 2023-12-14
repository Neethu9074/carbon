/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

export const documentationCloudNativeBuildPack = () => {
  return (
    <Stack direction="vertical" gap="small">
      <DocumentLink
        text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
        href="https://ibm.biz/insta-agent-gcp-setup"
      />
      <DocumentLink
        text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
        href="https://ibm.biz/insta-gcr-collectors"
      />
      <DocumentLink
        text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
        href="https://ibm.biz/agents-google-cloud-run"
      />
      <DocumentLink
        text={t('in-plg:agentDetails.aws.documentationLinks.gcBuildpackDocs')}
        href="https://ibm.biz/google-cloud-buildpack-docs"
      />
    </Stack>
  );
};

export const documentationRuntimes = (runtime: 'Go' | 'Java' | 'Dotnet' | 'NodeJs' | 'Python') => {
  switch (runtime) {
    case 'Go':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGo')}
            href="https://ibm.biz/monitoring-go"
          />
        </Stack>
      );
    case 'Java':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
        </Stack>
      );
    case 'Dotnet':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.gcrDocumentation')}
            href="https://ibm.biz/google-cloud-run-docs"
          />
        </Stack>
      );
    case 'NodeJs':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringNodejs')}
            href="https://ibm.biz/monitoring-nodejs"
          />
        </Stack>
      );
    case 'Python':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringPython')}
            href="https://ibm.biz/instana-python-pkg"
          />
        </Stack>
      );
    default:
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.setupGcpAgent')}
            href="https://ibm.biz/insta-agent-gcp-setup"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.installGcrCollectors')}
            href="https://ibm.biz/insta-gcr-collectors"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGcr')}
            href="https://ibm.biz/agents-google-cloud-run"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.documentationLinks.monitoringGo')}
            href="https://ibm.biz/monitoring-go"
          />
        </Stack>
      );
  }
};
