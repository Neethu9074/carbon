/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
import { t } from 'in-i18n';

const agentModeOptions = ['dynamic', 'static'];

const agentOptions = [
  { key: 'linux64', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux64Bit') },
  { key: 'linux32', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux32Bit') },
  { key: 'linuxarm64', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux64BitArm') },
  { key: 'linuxarm32', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux32BitArm') },
  { key: 'linuxppc64', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux64BitPowerPc') },
  { key: 'linuxppc32', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux32BitPowerPc') },
  { key: 'linuxppcle64', label: t('in-plg:agentDetails.linux.archive.agentOptions.linux64BitPowerPcLittleEndian') },
  { key: 'linuxs390x', label: t('in-plg:agentDetails.linux.archive.agentOptions.linuxS390X') }
];

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

const LinuxArchive = ({ tenant, tenantUnit, agentKey, downloadKey, butlerDomain, fromOnboarding }: OnboardingProps) => {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const [option, setOption] = useState(agentOptions[0].key);
  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.linux.archive.hostRequirements')}
            href="https://ibm.biz/inst-agent-linuxtar-prereqs"
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
            text={t('in-plg:agentDetails.linux.archive.installUsingATarFile')}
            href="https://ibm.biz/insta-agent-linuxtar"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.linux.archive.startingTheAgent')}
            href="https://ibm.biz/insta-agent-linuxstart"
          />
        </>
      ),
      openByDefault: true
    }
  ];

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.linux.archive.selectTheAgentPackagingMode')}>
          <KeyValue
            label={t('in-plg:agentDetails.common.packaging')}
            value={Packaging({ agentMode, agentModeOptions, setAgentMode })}
            withGap
          />
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.linux.archive.selecTthePlatformArchitecture')}>
          <KeyValue
            label={t('in-plg:agentDetails.linux.archive.platformArchitecture')}
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

        <GetDeployedAgents agent="linux" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default LinuxArchive;
