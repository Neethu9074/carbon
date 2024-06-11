/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton } from '@instana/components';

import { getAgentDownloadURL } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const agentOptions = [
  { key: 'mac', label: t('in-waiting-for-deployment:content.macOs64BitUniversal') },
  { key: 'macStatic', label: t('in-waiting-for-deployment:content.macOs64BitUniversalStatic') }
];

export default function MacOs({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) {
  const agentModeOptions = ['Dynamic', 'Static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const [option, setOption] = useState(agentOptions[0].key);

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.unix.previewPrerequisites')}
            href="https://ibm.biz/insta-agent-macos-prereqs"
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
            text={t('in-plg:agentDetails.macOs.downloadingTheAgent')}
            href="https://ibm.biz/insta-agent-macos-download"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.macOs.startingTheAgent')}
            href="https://ibm.biz/insta-agent-macos-start"
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

  if (shareAndInviteEnabled) sideCardData.pop();

  function getAgentPackagingMode() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={t('in-plg:agentDetails.agentMode.dynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => {
            setAgentMode(agentModeOptions[0]);
            setOption(agentOptions[0].key);
          }}
          size="default"
        />
        <RadioButton
          label={t('in-plg:agentDetails.agentMode.static')}
          checked={agentMode === agentModeOptions[1]}
          onChange={() => {
            setAgentMode(agentModeOptions[1]);
            setOption(agentOptions[1].key);
          }}
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

        <LayoutSection title={t('in-plg:agentDetails.mac.selectAgentPackagingMode')}>
          <KeyValue label={t('in-plg:agentDetails.common.packaging')} value={getAgentPackagingMode()} withGap />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.mac.reviewThePrerequisitesAndRunTheAgentDeploymentCode')}>
          <InputWithButton
            type="download"
            href={getAgentDownloadURL(tenant, tenantUnit, agentKey, downloadKey, option, butlerDomain)}
            inputValue={agentOptions.find(agent => agent.key === option)?.label}
          />
        </LayoutSection>

        <GetDeployedAgents agent="mac" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
