/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Code } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import SupportViewSectionV2 from 'in-plg/pages/onboarding/Layout/SupportViewSectionV2';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

const LinuxAutomaticOTel = ({ agentKey, agentEndpoint, agentEndpointPort, fromOnboarding }: OnboardingProps) => {
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

  return (
    <Container>
      <MainBody>
        <LayoutSection title={t('in-plg:agentDetails.linux.linux_auto_otel.step1SelectTheCollectorPackagingMode')}>
          <Code
            lang="bash"
            code={`curl - Lo setup.sh https://github.com/instana/instana-otel-collector/releases/latest/download/instana-collector-installer-latest.sh && chmod +x setup.sh && ./setup.sh -a ${agentKey} ${agentEndpoint}:${agentEndpointPort}`}
            softWrap
          />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_auto_otel.step2RunTheOpenTelemetryDeploymentCode')}>
          <Code
            lang="bash"
            code={`exporters:
  otlp:
    endpoint: ‘http://instana-agent.instana-agent:4317’
      tls:
        insecurw: true
  otlpttp:
    endpoint: ‘http://instana-agent.instana-agent:4318’
      tls:
       insecurw: true`}
            showLineNumbers
          />
        </LayoutSection>
        <GetDeployedAgents agent="linux" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSectionV2 items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default LinuxAutomaticOTel;
