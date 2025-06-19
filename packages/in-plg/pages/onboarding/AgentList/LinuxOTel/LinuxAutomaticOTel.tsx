/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import { Code } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import SupportViewSectionV2 from 'in-plg/pages/onboarding/Layout/SupportViewSectionV2';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

const OTelLinuxConfigUrl =
  'https://raw.githubusercontent.com/instana/instana-otel-collector/refs/heads/main/config/linux/config.yaml';

const LinuxAutomaticOTel = ({ agentKey, agentEndpoint, fromOnboarding, region, butlerDomain }: OnboardingProps) => {
  const [linuxConfigYaml, setLinuxConfigYaml] = useState('');

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.SupportLinks'),
      links: [
        {
          title: t('in-plg:agentDetails.linux.linux_auto_otel.learnMoreAboutInstanaOtelCollector'),
          href: 'https://ibm.biz/distribution-otel-collector'
        },
        {
          title: t('in-plg:agentDetails.linux.linux_auto_otel.gitHubInstanaOtelCollector'),
          href: 'https://ibm.biz/instana-otel-collector'
        },
        {
          title: t('in-plg:agentDetails.linux.linux_auto_otel.networkRequirements'),
          href: 'https://ibm.biz/otel-collector-distribution-requirements'
        }
      ]
    }
  ];

  const { otlpHttpEndpointWithPort, otlpGrpcEndpointWithPort } = generateOtlpEndpointWithPort({
    agentEndpoint,
    region
  });

  let deploymentCodeWithAddedConfig = linuxConfigYaml
    .replaceAll('${env:INSTANA_OTEL_ENDPOINT_GRPC:-localhost:4317}', otlpGrpcEndpointWithPort)
    .replaceAll('${env:INSTANA_OTEL_ENDPOINT_HTTP:-http://localhost:8992}', otlpHttpEndpointWithPort)
    .replaceAll('${env:INSTANA_KEY:-instanalocal}', agentKey ?? '<INSTANA_KEY>')
    .replaceAll('${env:INSTANA_HOST:-"yourhost.ibm.com"}', butlerDomain ?? '<INSTANA_HOST>');

  useEffect(() => {
    (async () => {
      // fetch the yaml file
      setLinuxConfigYaml((await fetchOtelLinuxConfigYaml(OTelLinuxConfigUrl)) || '');
    })();
  }, []);

  return (
    <Container>
      <MainBody>
        <LayoutSection title={t('in-plg:agentDetails.linux.linux_auto_otel.step1SelectTheCollectorPackagingMode')}>
          <Code
            lang="bash"
            code={`curl - Lo setup.sh https://github.com/instana/instana-otel-collector/releases/latest/download/instana-collector-installer-latest.sh && chmod +x setup.sh && ./setup.sh -a ${agentKey} -e ${otlpGrpcEndpointWithPort} -H ${otlpHttpEndpointWithPort}`}
            softWrap
          />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_auto_otel.step2RunTheOpenTelemetryDeploymentCode')}>
          <Code lang="yaml" code={deploymentCodeWithAddedConfig} showLineNumbers withExpandButton />
        </LayoutSection>
        <GetDeployedAgents agent="otel" fromOnboarding={fromOnboarding} datasource="collector" />
      </MainBody>
      <SidePanel>
        <SupportViewSectionV2 items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

interface generateOtlpEndpointProps {
  agentEndpoint: string | undefined | null;
  region: string | undefined | null;
}

const generateOtlpEndpointWithPort = ({ agentEndpoint, region }: generateOtlpEndpointProps) => {
  let otlpHttpEndpointWithPort = '';
  let otlpGrpcEndpointWithPort = '';
  const specialRegionPort = 443;
  const httpPort = 4318;
  const grpcPort = 4317;
  const specialRegions = ['teal', 'mizu', 'pumpkin'];

  if (!agentEndpoint || !region)
    return {
      otlpHttpEndpointWithPort: '<INSTANA_OTEL_ENDPOINT_HTTP>',
      otlpGrpcEndpointWithPort: '<INSTANA_OTEL_ENDPOINT_GRPC>'
    };

  if (specialRegions.includes(region)) {
    otlpHttpEndpointWithPort = agentEndpoint.replace('ingress', 'otlp-http');
    otlpHttpEndpointWithPort = `${otlpHttpEndpointWithPort}:${specialRegionPort}`;
    otlpGrpcEndpointWithPort = agentEndpoint.replace('ingress', 'otlp-grpc');
    otlpGrpcEndpointWithPort = `${otlpGrpcEndpointWithPort}:${specialRegionPort}`;
  } else {
    otlpHttpEndpointWithPort = agentEndpoint.replace('ingress', 'otlp');
    otlpHttpEndpointWithPort = `${otlpHttpEndpointWithPort}:${httpPort}`;
    otlpGrpcEndpointWithPort = agentEndpoint.replace('ingress', 'otlp');
    otlpGrpcEndpointWithPort = `${otlpGrpcEndpointWithPort}:${grpcPort}`;
  }

  return {
    otlpHttpEndpointWithPort,
    otlpGrpcEndpointWithPort
  };
};

const fetchOtelLinuxConfigYaml = async (apiUrl: string) => {
  return fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch OTel linux config YAML');
      return res.text();
    })
    .catch(() => undefined);
};

export default LinuxAutomaticOTel;
