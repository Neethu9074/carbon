/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

//@ts-expect-error
import instanaAgentOpenShiftYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent-openshift.yaml';
//@ts-expect-error
import customResourceFile from 'in-plg/pages/onboarding/AgentList/Openshift/content/instana_v1_instanaagent.yaml';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { CodeProps } from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface BashCodeProps {
  id: string;
  agentZone?: string;
  clusterName?: string;
  downloadKey: string;
  agentKey: string;
  instanaDomain?: string;
  agentEndpoint?: string;
  agentEndpointPort?: string;
}

export const getPrerequisites = (id: string): JSX.Element => {
  const openshiftPrerequisities = () => {
    if (id == 'openshift_operator')
      return (
        <DocumentLink
          text={t('in-plg:agentDetails.openshift.documentLinks.setUpProject')}
          href="https://ibm.biz/insta-agent-rhoprereqs"
        />
      );
    else return <></>;
  };
  return (
    <Stack direction="vertical" gap="small">
      <DocumentLink
        text={t('in-plg:agentDetails.common.choosingTheProperInstallationMethod')}
        href="https://ibm.biz/insta-agent-rhochoose"
      />
      <DocumentLink
        text={t('in-plg:agentDetails.common.networkRequirements')}
        href="https://ibm.biz/insta-agent-netreqs"
      />
      {openshiftPrerequisities()}
    </Stack>
  );
};

export const getDocumentations = (id: string): JSX.Element => {
  const openshiftDocumentations = () => {
    switch (id) {
      case 'openshift_operator':
        return (
          <>
            <DocumentLink
              text={t('in-plg:agentDetails.openshift.documentLinks.installOperatorByUsingOlm')}
              href="https://ibm.biz/insta-agent-rhoolm"
            />
            <DocumentLink
              text={t('in-plg:agentDetails.openshift.documentLinks.installAgentUsingOperator')}
              href="https://ibm.biz/rhosagent-install-manual"
            />
          </>
        );
      case 'openshift_helm':
        return (
          <DocumentLink
            text={t('in-plg:agentDetails.openshift.documentLinks.installUsingHelm')}
            href="https://ibm.biz/rhosagent-install-helm"
          />
        );
      case 'openshift_k8_daemon':
        return (
          <DocumentLink
            text={t('in-plg:agentDetails.openshift.documentLinks.installUsingYaml')}
            href="https://ibm.biz/rhosagent-install-yaml"
          />
        );
      default:
        return <></>;
    }
  };
  return (
    <Stack direction="vertical" gap="small">
      {openshiftDocumentations()}
      <DocumentLink
        text={t('in-plg:agentDetails.openshift.documentLinks.configuringAgentAfterInstall')}
        href="https://ibm.biz/rhosagent-administer"
      />
    </Stack>
  );
};
export const getBashCode = ({
  id,
  agentZone,
  clusterName,
  downloadKey,
  agentKey,
  instanaDomain,
  agentEndpoint,
  agentEndpointPort
}: BashCodeProps): CodeProps => {
  switch (id) {
    case 'openshift_operator': {
      let content = customResourceFile
        .replaceAll('${agentKey}', agentKey)
        .replaceAll('${agentEndpoint}', agentEndpoint)
        .replaceAll('${agentEndpointPort}', agentEndpointPort)
        .replaceAll('${clusterName}', clusterName)
        .replaceAll('${zoneName}', agentZone);
      content = content.split('\n');
      return {
        code: content,
        lang: 'bash',
        withoutCopyButton: !(clusterName && agentKey && agentEndpoint && agentEndpointPort),
        withExpandButton: true,
        linesToShow: 15
      };
    }
    case 'openshift_helm': {
      let content = [];
      content.push(
        'helm install instana-agent \\',
        '   --repo https://agents.instana.io/helm \\',
        '   --namespace instana-agent \\',
        '   --create-namespace \\',
        '   --set openshift=true \\',
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
        withoutCopyButton: !(clusterName && downloadKey && agentKey && agentEndpoint && agentEndpointPort),
        withExpandButton: true,
        linesToShow: 15
      };
    }
    case 'openshift_k8_daemon': {
      let content = instanaAgentOpenShiftYaml
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
        withoutCopyButton: !(clusterName && downloadKey && agentKey && agentEndpoint && agentEndpointPort),
        withExpandButton: true,
        linesToShow: 15
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
