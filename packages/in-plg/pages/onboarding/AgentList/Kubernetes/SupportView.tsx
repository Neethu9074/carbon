/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography, Stack } from '@instana/components';

// @ts-expect-error
import instanaAgentYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent.yaml';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { CodeProps } from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface BashCodeProps {
  id: string;
  agentZone: string;
  clusterName: string;
  agentKey: string;
  downloadKey: string;
  instanaDomain?: string;
  agentEndpoint?: string;
  agentEndpointPort?: string;
}

export const Prerequisites = ({ id }: { id: string }): JSX.Element => {
  switch (id) {
    case 'k8_helm':
      return (
        <Stack direction="vertical" gap="small">
          <Typography variant="body-regular">Helm version 3 is required.</Typography>
          <ChooseProperInstallationAndNetworkRequiremtent />
        </Stack>
      );
    case 'k8_deamon':
      return <ChooseProperInstallationAndNetworkRequiremtent />;
    case 'k8_aks':
      return <ChooseProperInstallationAndNetworkRequiremtent />;
    case 'k8_eks':
      return (
        <DocumentLink
          text={t('in-plg:agentDetails.common.networkRequirements')}
          href="https://ibm.biz/insta-agent-netreqs"
        />
      );
    default:
      return <></>;
  }
};

export const Documentations = ({ id }: { id: string }): JSX.Element => {
  switch (id) {
    case 'k8_helm':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.helmChart.installAnAgentOnKubernetes')}
            href="https://ibm.biz/k8sagent-install-helm"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.helmChart.configurationParameters')}
            href="https://ibm.biz/insta-agent-helmparams"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.configuringTheAgentAfterInstall')}
            href="https://ibm.biz/K8s-agent-administer"
          />
        </Stack>
      );
    case 'k8_deamon':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.k8_deamon.installUsingYAML')}
            href="https://ibm.biz/K8sagent-install-yaml"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.k8_deamon.installAnAgentOnKubernetes')}
            href="https://ibm.biz/K8s-agent-install"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.configuringTheAgentAfterInstall')}
            href="https://ibm.biz/K8s-agent-administer"
          />
        </Stack>
      );
    case 'k8_aks':
      return (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.k8_aks.installAnAgentOnAKS')}
            href="https://ibm.biz/insta-agent-aks"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.configuringTheAgentAfterInstall')}
            href="https://ibm.biz/K8s-agent-administer"
          />
        </Stack>
      );
    case 'k8_eks':
      return (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.k8_eks.installAnAgentOnAWSEKS')}
            href="https://ibm.biz/insta-agent-awseks"
          />
        </>
      );
    default:
      return <></>;
  }
};

export const getBashCode = ({
  id,
  agentZone,
  clusterName,
  agentKey,
  downloadKey,
  instanaDomain,
  agentEndpoint,
  agentEndpointPort
}: BashCodeProps): CodeProps => {
  switch (id) {
    case 'k8_helm': {
      let content = [];
      content.push(
        'helm install instana-agent \\',
        `   --repo https://agents.instana.${instanaDomain}/helm \\`,
        '   --namespace instana-agent \\',
        '   --create-namespace \\',
        `   --set agent.key=${agentKey} \\`,
        `   --set agent.downloadKey=${downloadKey} \\`,
        `   --set agent.endpointHost=${agentEndpoint} \\`,
        `   --set agent.endpointPort=${agentEndpointPort} \\`,
        `   --set cluster.name='${clusterName}' \\`
      );
      if (agentZone) content.push(`   --set zone.name='${agentZone}' \\`);
      content.push('   instana-agent');

      return {
        code: content,
        lang: 'bash',
        withoutCopyButton: !(clusterName && downloadKey && agentEndpoint && agentEndpointPort),
        withExpandButton: false
      };
    }
    case 'k8_deamon':
    case 'k8_aks':
    case 'azure_aks':
    case 'k8_eks': {
      let content = instanaAgentYaml
        .replaceAll('${agentKey}', window.btoa(agentKey))
        .replaceAll('${downloadKey}', window.btoa(downloadKey))
        .replaceAll('${agentEndpoint}', agentEndpoint)
        .replaceAll('${agentEndpointPort}', agentEndpointPort)
        .replaceAll('${clusterName}', clusterName)
        .replaceAll('${zoneName}', agentZone)
        .replaceAll('${instanaMvnRepoUrl}', `https://artifact-public.instana.${instanaDomain}`);
      content = content.split('\n');

      return {
        code: content,
        lang: 'yaml',
        withDownload: true,
        withoutCopyButton: !(clusterName && downloadKey && agentEndpoint && agentEndpointPort),
        withExpandButton: true
      };
    }
    default:
      return {
        code: [],
        lang: 'bash',
        withoutCopyButton: true,
        withExpandButton: false,
        linesToShow: 5
      };
  }
};

const ChooseProperInstallationAndNetworkRequiremtent = (): JSX.Element => (
  <Stack direction="vertical" gap="small">
    <DocumentLink
      text={t('in-plg:agentDetails.common.choosingTheProperInstallationMethod')}
      href="https://ibm.biz/insta-agent-K8schoose"
    />
    <DocumentLink
      text={t('in-plg:agentDetails.common.networkRequirements')}
      href="https://ibm.biz/insta-agent-netreqs"
    />
  </Stack>
);
