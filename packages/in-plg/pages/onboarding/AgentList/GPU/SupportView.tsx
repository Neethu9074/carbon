/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

//@ts-expect-error
import customResourceFile from 'in-plg/pages/onboarding/AgentList/GPU/content/opentelemetry_collector.yaml';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { CodeProps } from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface BashCodeProps {
  id: string;
  dcgmExporterEndpoint?: string;
  agentServiceEndpoint?: string;
  agentZone?: string;
  clusterName?: string;
  downloadKey: string;
  agentKey: string;
  instanaDomain?: string;
  agentEndpoint?: string;
  agentEndpointPort?: string;
}

export const getPrerequisites = (): JSX.Element => {
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
      <DocumentLink
        text={t('in-plg:agentDetails.gpu.documentLinks.preGPUOperator')}
        href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html#prerequisites"
      />
    </Stack>
  );
};

export const getDocumentations = (id: string): JSX.Element => {
  const openshiftDocumentations = () => {
    switch (id) {
      case 'gpu':
        return (
          <>
            <DocumentLink
              text={t('in-plg:agentDetails.gpu.documentLinks.installDcgmExporter')}
              href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html"
            />
          </>
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
        href="https://ibm.biz/insta-agent-config"
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
  agentEndpoint,
  agentEndpointPort
}: BashCodeProps): CodeProps => {
  switch (id) {
    case 'gpu': {
      let content = [];
      content.push(
        'helm install instana-agent \\',
        '   --repo https://agents.instana.io/helm \\',
        '   --namespace instana-agent \\',
        '   --create-namespace \\',
        `   --set agent.key=${agentKey} \\`,
        `   --set agent.downloadKey=${downloadKey} \\`,
        `   --set agent.endpointHost=${agentEndpoint} \\`,
        `   --set agent.endpointPort=${agentEndpointPort} \\`,
        `   --set opentelemetry.enabled=true \\`,
        `   --set opentelemetry.grpc.enabled=true \\`,
        `   --set opentelemetry.http.enabled=true \\`,
        `   --set agent.listenAddress=* \\`,
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

export const getDcgmExporter = ({ id }: BashCodeProps): CodeProps => {
  switch (id) {
    default: {
      let content = [];
      content.push(
        'helm install gpu-operator \\',
        '   --repo https://helm.ngc.nvidia.com/nvidia \\',
        '   --namespace gpu-operator \\',
        '   --create-namespace \\',
        '   -set driver.enabled=false \\',
        '   -set toolkit.enabled=false \\',
        '   -set devicePlugin.enabled=false \\',
        '   -set mig.strategy=single \\',
        '   gpu-operator '
      );
      return {
        code: content,
        lang: 'bash',
        withExpandButton: true,
        linesToShow: 15
      };
    }
  }
};

export const getOCBPipeline = ({ id, dcgmExporterEndpoint, agentServiceEndpoint }: BashCodeProps): CodeProps => {
  switch (id) {
    default: {
      {
        let content = customResourceFile
          .replaceAll('${dcgmExporterEndpoint}', dcgmExporterEndpoint)
          .replaceAll('${agentServiceEndpoint}', agentServiceEndpoint);
        content = content.split('\n');
        return {
          code: content,
          lang: 'bash',
          withExpandButton: true,
          linesToShow: 15
        };
      }
    }
  }
};

export const getOCB = ({ id }: BashCodeProps): CodeProps => {
  switch (id) {
    default: {
      let content = [];
      content.push(
        'kubectl apply -f \\',
        '   https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml '
      );

      return {
        code: content,
        lang: 'bash',
        withExpandButton: true,
        linesToShow: 15
      };
    }
  }
};
