/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { Stack, Typography, KeyValue, RadioButton, IconButton } from '@instana/components';

import { getPlatformArchitectures, supportViewData } from 'in-plg/pages/onboarding/AgentList/Unix/Data';
import { DropDown, getAgentDownloadURL } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

const agentModeOptions = [
  { key: 'dynamic', label: t('in-plg:agentDetails.agentMode.dynamic') },
  { key: 'static', label: t('in-plg:agentDetails.agentMode.static') }
];

export default function Unix({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0].key);
  const getPlatformArchitectureValue = getPlatformArchitectures(agentMode);
  const [selectedPlatform, setSelectedPlatform] = useState(getPlatformArchitectureValue[0].label);
  const [platformArch, setPlatformArch] = useState(getPlatformArchitectureValue[0]);

  function getPlatformArch() {
    return (
      <Stack direction="horizontal" align="end" gap="disabled">
        <DropDown
          value={selectedPlatform}
          options={getPlatformArchitectureValue.map(option => option.label)}
          onChange={setSelectedPlatform}
        />
        <IconButton
          href={getAgentDownloadURL(tenant, tenantUnit, agentKey, downloadKey, platformArch.key, butlerDomain)}
          type="lib_actions_download"
          iconSize="xs"
          kind="action"
        />
      </Stack>
    );
  }

  function getInstallationMethod() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={agentModeOptions[0].label}
          checked={agentMode === agentModeOptions[0].key}
          onChange={() => setAgentMode(agentModeOptions[0].key)}
          size="default"
        />
        <RadioButton
          label={agentModeOptions[1].label}
          checked={agentMode === agentModeOptions[1].key}
          onChange={() => setAgentMode(agentModeOptions[1].key)}
          size="default"
        />
      </Stack>
    );
  }

  useEffect(() => {
    const platformSelected = getPlatformArchitectureValue.find(platform => platform.label === selectedPlatform);
    if (platformSelected) {
      setPlatformArch(platformSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentMode, selectedPlatform]);

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_ec2_64.selectTheAgentPackagingMode')}>
          <KeyValue label={t('in-plg:agentDetails.gcp.installationMethod')} value={getInstallationMethod()} withGap />
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.common.step2') + t('in-plg:agentDetails.unix.selectThePlatformArchitecture')}
        >
          <KeyValue label={t('in-plg:agentDetails.unix.platformArchitecture')} value={getPlatformArch()} withGap />
        </LayoutSection>

        <GetDeployedAgents agent={platformArch.searchKey} fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData(agentKey)} />
      </SidePanel>
    </Container>
  );
}
