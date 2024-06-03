/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

//@ts-expect-error
import instanaAgentYaml from 'in-waiting-for-deployment/components/OnboardingWidget/content/instana-agent.yaml';
import ExpandableCardPlg from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import { AgentFormInput } from 'in-plg/pages/onboarding/content/ContentComponents';
import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

const AwsEks = ({
  agentKey,
  downloadKey,
  instanaDomain,
  agentEndpoint,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps) => {
  const [clusterName, setClusterName] = useState<string>('');
  const [agentZone, setAgentZone] = useState<string>('');

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <DocumentLink
          text={t('in-plg:agentDetails.aws.documentationLinks.installAgentAwsEks')}
          href="https://ibm.biz/insta-agent-awseks"
        />
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  if (shareAndInviteEnabled) sideCardData.pop();

  const getBashCode = () => {
    let content = instanaAgentYaml
      .replaceAll('${agentKey}', window.btoa(agentKey))
      .replaceAll('${downloadKey}', window.btoa(downloadKey))
      .replaceAll('${agentEndpoint}', agentEndpoint)
      .replaceAll('${agentEndpointPort}', agentEndpointPort)
      .replaceAll('${clusterName}', clusterName)
      .replaceAll('${zoneName}', agentZone)
      .replaceAll('${instanaMvnRepoUrl}', `https://artifact-public.instana.${instanaDomain}`);
    content = content.split('\n');
    return content;
  };

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
          title={
            t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.enterAClusterNameAndOptionallyTheAgentZone')
          }
        >
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.common.clusterName')}
              value={<AgentFormInput onChange={value => setClusterName(value)} />}
              withGap
            />
            <AgentzoneLister callBackFunc={updateAgentZone} />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.runCodeBelow')}>
          <Code lang="yaml" code={getBashCode()} withDownload withExpandButton linesToShow={15} />
        </LayoutSection>

        <GetDeployedAgents agent="eks%20AND%20aws" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <Typography variant="heading-200">{t('in-plg:agentDetails.kubernetes.kubernetes.support')}</Typography>
        <>
          {sideCardData.map((sideCard, index) => (
            <ExpandableCardPlg
              key={index}
              title={sideCard?.title}
              body={sideCard?.body}
              openByDefault={!!sideCard?.openByDefault}
            />
          ))}
        </>
      </SidePanel>
    </Container>
  );
};

export default AwsEks;
