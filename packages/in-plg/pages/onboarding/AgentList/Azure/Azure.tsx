/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

//@ts-expect-error
import instanaAgentYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent.yaml';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { CodeProps } from 'in-plg/components/Code/Code';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

const Azure = ({
  agentKey,
  downloadKey,
  instanaDomain,
  agentEndpoint,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps) => {
  const [clusterName, setClusterName] = useState('');
  const [agentZone, setAgentZone] = useState('');

  const getBashCode = (): CodeProps => {
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
  };

  const supportViewData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
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
            text={t('in-plg:agentDetails.azure.installingAgentOnAks')}
            href="https://ibm.biz/insta-agent-aks"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.azure.configureAfterInstall')}
            href="https://ibm.biz/insta-agent-config"
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

  if (shareAndInviteEnabled) supportViewData.pop();

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
          title={t('in-plg:agentDetails.kubernetes.kubernetes.enterAClusterNameAndOptionallyTheAgentZone')}
        >
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.common.clusterName')}
              value={
                <FormInputPlg
                  onChange={value => setClusterName(value)}
                  placeholder={t('in-waiting-for-deployment:content.clusterNameEGProd')}
                />
              }
              withGap
            />
            <AgentzoneLister callBackFunc={updateAgentZone} />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.kubernetes.kubernetes.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}
        >
          <Code {...getBashCode()} />
        </LayoutSection>

        <GetDeployedAgents agent="azure" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
};

export default Azure;
