/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useMemo } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function Docker({ agentKey, downloadKey }: OnboardingProps): JSX.Element {
  const [agentZone, setAgentZone] = useState<string>('');
  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.docker.pullTheAgentContainerImage')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-docker#pulling-the-instana-agent-container-image"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.runTheInstanaAgentContainerImage')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-docker#running-the-instana-agent-container-image"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.upgradeTheInstanaAgentContainerImage')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-docker#upgrading-the-instana-agent-container-image"
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
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-docker#installation"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.docker.configurationOptions')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-docker#agent-configuration"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  const createDockerScript = useMemo(() => {
    let zoneEnv = agentZone.length === 0 ? '' : `--env="INSTANA_AGENT_ZONE=${agentZone}" \\ \n`;

    return [
      'sudo docker run \\',
      '--detach \\',
      '--name instana-agent \\ ',
      '--volume /var/run:/var/run \\',
      '--volume /dev:/dev:ro \\',
      '--volume /sys:/sys:ro \\',
      '--volume /var/log:/var/log:ro \\',
      '--privileged \\',
      '--net=host \\',
      '--pid=host \\',
      '--env="INSTANA_AGENT_ENDPOINT=ingress-blue-saas.instana.io" \\',
      '--env="INSTANA_AGENT_ENDPOINT_PORT=443" \\',
      `--env="INSTANA_AGENT_KEY=${agentKey}" \\`,
      `--env="INSTANA_DOWNLOAD_KEY=${downloadKey}" \\`,
      zoneEnv,
      'icr.io/instana/agent'
    ];
  }, [agentZone, agentKey, downloadKey]);

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={
            t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.enterAClusterNameAndOptionallyTheAgentZone')
          }
        >
          <KeyValue
            label={t('in-plg:agentDetails.common.agentZoneOptional')}
            value={<FormInputPlg onChange={value => setAgentZone(value)} />}
            withGap
          />
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.kubernetes.kubernetes.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}
        >
          <Code lang="bash" code={createDockerScript} />
        </LayoutSection>

        <GetDeployedAgents agent="docker" />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
