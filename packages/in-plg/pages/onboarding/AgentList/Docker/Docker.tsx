/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useMemo } from 'react';

import { Stack, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function Docker({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const [agentZone, setAgentZone] = useState<string>('');
  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.docker.pullTheAgentContainerImage')}
            href="https://ibm.biz/inst-agent-dockerpull"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.runTheInstanaAgentContainerImage')}
            href="https://ibm.biz/inst-agent-dockerrun"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.upgradeTheInstanaAgentContainerImage')}
            href="https://ibm.biz/inst-agent-dockerupg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.docker.installAgentOnDocker')}
            href="https://ibm.biz/inst-agent-docker"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.configurationOptions')}
            href="https://ibm.biz/inst-agent-dockercfg"
          />
        </Stack>
      ),
      openByDefault: true
    }
  ];

  const createDockerScript = useMemo(() => {
    let zoneEnv = agentZone.length === 0 ? null : `   --env="INSTANA_AGENT_ZONE=${agentZone}" \\`;

    const script = [
      'sudo docker run \\',
      '   --detach \\',
      '   --name instana-agent \\',
      '   --volume /var/run:/var/run \\',
      '   --volume /run:/run \\',
      '   --volume /dev:/dev:ro \\',
      '   --volume /sys:/sys:ro \\',
      '   --volume /var/log:/var/log:ro \\',
      '   --privileged \\',
      '   --net=host \\',
      '   --pid=host \\',
      `   --env="INSTANA_AGENT_ENDPOINT=${agentEndpoint}" \\`,
      `   --env="INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort}" \\`,
      `   --env="INSTANA_AGENT_KEY=${agentKey}" \\`,
      `   --env="INSTANA_DOWNLOAD_KEY=${downloadKey}" \\`
    ];
    if (zoneEnv) {
      script.push(zoneEnv);
    }
    script.push('   icr.io/instana/agent');
    return script;
  }, [agentZone, agentKey, downloadKey, agentEndpoint, agentEndpointPort]);

  const updateAgentZone = (agent: string) => {
    setAgentZone(agent);
  };

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={t('in-plg:agentDetails.common.step1') + t('in-plg:agentDetails.docker.optionallyEnterTheAgentZone')}
        >
          <AgentzoneLister agent="docker" callBackFunc={updateAgentZone} />
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.kubernetes.kubernetes.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}
        >
          <Code lang="bash" code={createDockerScript} />
        </LayoutSection>

        <GetDeployedAgents agent="docker" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
