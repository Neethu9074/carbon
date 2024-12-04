/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton, IconButton } from '@instana/components';

import { getAgentDownloadURL } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const agentModeOptions = ['dynamic', 'static'];

const agentOptions = [{ key: 'ibmi64', label: t('in-plg:agentDetails.ibmi.archive.agentOptions.ibmi64Bit') }];

interface PackagingProps {
  agentMode: string;
  agentModeOptions: string[];
  setAgentMode: React.Dispatch<React.SetStateAction<string>>;
}

function Packaging({ agentMode, agentModeOptions, setAgentMode }: PackagingProps) {
  return (
    <Stack direction="horizontal">
      <RadioButton
        label={t('in-plg:agentDetails.agentMode.dynamic')}
        checked={agentMode === agentModeOptions[0]}
        onChange={() => setAgentMode(agentModeOptions[0])}
        size="default"
      />
      <RadioButton
        label={t('in-plg:agentDetails.agentMode.static')}
        checked={agentMode === agentModeOptions[1]}
        onChange={() => setAgentMode(agentModeOptions[1])}
        size="default"
      />
    </Stack>
  );
}

interface PlatformArchitectureProps {
  option: string;
  setOption: React.Dispatch<React.SetStateAction<string>>;
  agentMode: string;
  agentKey: string;
  tenant?: string;
  tenantUnit?: string;
  downloadKey: string;
  butlerDomain?: string;
}

function PlatformArchitecture({
  option,
  setOption,
  agentMode,
  agentKey,
  tenant,
  tenantUnit,
  downloadKey,
  butlerDomain
}: PlatformArchitectureProps) {
  return (
    <Stack direction="horizontal" gap="disabled">
      <DropDown value={option} options={agentOptions} onChange={setOption} />
      <IconButton
        target="_blank"
        type="lib_actions_download"
        iconSize="xs"
        kind="action"
        href={getAgentDownloadURL(
          tenant,
          tenantUnit,
          agentKey,
          downloadKey,
          agentMode === 'dynamic' ? option : `${option}Static`,
          butlerDomain
        )}
      />
    </Stack>
  );
}

const IBMiArchive = ({ tenant, tenantUnit, agentKey, downloadKey, butlerDomain, fromOnboarding }: OnboardingProps) => {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const [option, setOption] = useState(agentOptions[0].key);
  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.ibmi.archive.beforeYouInstall')}
            href="http://ibm.biz/host-agent-install-ibm-i-prereq"
          />
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
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.ibmi.archive.installingManually')}
            href="http://ibm.biz/host-agent-manual-install-ibm-i"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.ibmi.archive.startingTheAgent')}
            href="https://ibm.biz/host-agent-install-ibm-i-starting-host-agent"
          />
        </>
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

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.ibmi.archive.selectTheAgentPackagingMode')}>
          <KeyValue
            label={t('in-plg:agentDetails.common.packaging')}
            value={Packaging({ agentMode, agentModeOptions, setAgentMode })}
            withGap
          />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.ibmi.archive.selecTthePlatformArchitecture')}>
          <KeyValue
            label={t('in-plg:agentDetails.ibmi.archive.platformArchitecture')}
            value={PlatformArchitecture({
              option,
              setOption,
              agentMode,
              agentKey,
              tenant,
              tenantUnit,
              downloadKey,
              butlerDomain
            })}
            withGap
          />
        </LayoutSection>
        <GetDeployedAgents agent="ibmi" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default IBMiArchive;
