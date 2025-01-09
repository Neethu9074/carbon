/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton } from '@instana/components';

import { getAgentDownloadURL } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code, { CodeProps } from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

const WindowsEC2 = ({
  tenant,
  tenantUnit,
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  downloadKey,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) => {
  const agentModeOptions = ['dynamic', 'static'];

  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const getCode = (): CodeProps => {
    const agentModeOption = `exe64${agentMode === agentModeOptions[0] ? '' : 'offline'}`;

    return {
      code: [
        '<powershell>',
        `Invoke-WebRequest -OutFile "$env:TEMP\\AgentBootstrap.exe" -Uri "${getAgentDownloadURL(
          tenant,
          tenantUnit,
          agentKey,
          downloadKey,
          agentModeOption,
          butlerDomain
        )}"`,
        `Invoke-Expression -Command "$env:TEMP\\AgentBootstrap.exe INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} INSTANA_DOWNLOAD_KEY=${downloadKey} /quiet"`,
        '</powershell>'
      ],
      lang: 'bash',
      withoutCopyButton: !(tenant && tenantUnit && agentKey && downloadKey && agentModeOption && butlerDomain)
    };
  };

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.windows.windows_ec2_64.installAgentOnAWSEC2Windows')}
            href="https://ibm.biz/insta-agent-winawsec2"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.windows.windows_ec2_64.runCommandsOnAWSEC2')}
            href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"
          />
        </>
      ),
      openByDefault: true
    }
  ];

  function getPackaging() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-plg:agentDetails.windows.common.dynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => setAgentMode(agentModeOptions[0])}
          size="default"
        />
        <RadioButton
          label={t('in-plg:agentDetails.windows.common.static')}
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

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_ec2_64.selectTheAgentPackagingMode')}>
          <KeyValue label={'Packaging'} value={getPackaging()} withGap />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_ec2_64.useTheScriptAsUserDataForTheEC2Instance')}>
          <Stack direction="vertical">
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.windows.windows_ec2_64.installTheScriptOnTheVirtualMachine')}
            </Typography>
            <Code {...getCode()} />
          </Stack>
        </LayoutSection>

        <GetDeployedAgents agent="ec2%20AND%20windows" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default WindowsEC2;
