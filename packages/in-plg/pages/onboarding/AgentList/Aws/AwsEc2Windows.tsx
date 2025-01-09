/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import ExpandableCardPlg from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import { getAgentDownloadURL } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function AwsEc2Windows({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  tenant,
  tenantUnit,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) {
  const agentModeOptions = [t('in-plg:agentDetails.agentMode.dynamic'), t('in-plg:agentDetails.agentMode.static')];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const agentModeOption = `exe64${agentMode === agentModeOptions[0] ? '' : 'offline'}`;

  const sideCardData = [
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
            text={t('in-plg:agentDetails.aws.documentationLinks.installAgentOnAwsEc2')}
            href="https://ibm.biz/insta-agent-winawsec2"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.windows.windows_ec2_64.runCommandsOnAWSEC2')}
            href="https://ibm.biz/insta-agent-ec2wincmds"
          />
        </Stack>
      ),
      openByDefault: true
    }
  ];

  function getPackaging() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentModeDynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => setAgentMode(agentModeOptions[0])}
          size="default"
        />
        <RadioButton
          label={t('in-waiting-for-deployment:content.agentModeStatic')}
          checked={agentMode === agentModeOptions[1]}
          onChange={() => setAgentMode(agentModeOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectAgentPackagingAndRuntime')}
        >
          <KeyValue label={'Packaging'} value={getPackaging()} withGap />
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.aws.step2') + t('in-plg:agentDetails.aws.useScriptAsUserDataForEc2Instance')}
        >
          <Code
            lang="bash"
            code={[
              `<powershell>`,
              `Invoke-WebRequest -OutFile "$env:TEMP\\AgentBootstrap.exe" -Uri "${getAgentDownloadURL(
                tenant,
                tenantUnit,
                agentKey,
                downloadKey,
                agentModeOption,
                butlerDomain
              )}"`,
              `Invoke-Expression -Command "$env:TEMP\\AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} INSTANA_DOWNLOAD_KEY=${downloadKey} /quiet"`,
              `</powershell>`
            ]}
          />
        </LayoutSection>
        <GetDeployedAgents agent="ec2%20AND%20windows" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <Typography variant="body-bold">Support</Typography>
        <>
          {sideCardData.map((sideCard, index) => (
            <ExpandableCardPlg
              key={index}
              title={sideCard.title}
              body={sideCard.body}
              openByDefault={sideCard.openByDefault}
            />
          ))}
        </>
      </SidePanel>
    </Container>
  );
}
