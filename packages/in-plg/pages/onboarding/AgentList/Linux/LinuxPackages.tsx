/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';
import { Button } from '@instana/legacy';

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
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { t } from 'in-i18n';

export default function LinuxPackages({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) {
  const agentModeOptions = ['dynamic', 'static'];
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const jvmVendorOptions = ['azul', 'eclipse'];
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

  const installModeOptions = ['RPM', 'DEB'];
  const [installMode, setInstallMode] = useState(installModeOptions[0]);

  const rpmArchitectureOptions = [
    { key: 'aarch64', label: 'aarch64' },
    { key: 'ppc64', label: 'ppc64' },
    { key: 's390x', label: 's390x' },
    { key: 'x86_64', label: 'x86_64' },
    { key: 'el6_x86_64', label: 'el6 x86_64' },
    { key: 'el7_x86_64', label: 'el7 x86_64' }
  ];
  const debArchitectureOptions = [
    { key: 'amd64', label: 'amd64' },
    { key: 'arm64', label: 'arm64' },
    { key: 'ppc64', label: 'ppc64' },
    { key: 's390x', label: 's390x' }
  ];
  const rpmArchitectureOptionsJ9 = [
    { key: 'aarch64', label: 'aarch64' },
    { key: 'ppc64le', label: 'ppc64le' },
    { key: 's390x', label: 's390x' },
    { key: 'x86_64', label: 'x86_64' },
    { key: 'el6_x86_64', label: 'el6 x86_64' },
    { key: 'el7_x86_64', label: 'el7 x86_64' }
  ];
  const debArchitectureOptionsJ9 = [
    { key: 'amd64', label: 'amd64' },
    { key: 'arm64', label: 'arm64' },
    { key: 'ppc64el', label: 'ppc64el' },
    { key: 's390x', label: 's390x' }
  ];
  const architectureOptions =
    installMode === 'RPM' && jvmVendor === 'eclipse'
      ? rpmArchitectureOptionsJ9
      : installMode === 'RPM'
      ? rpmArchitectureOptions
      : installMode === 'DEB' && jvmVendor === 'eclipse'
      ? debArchitectureOptionsJ9
      : debArchitectureOptions;

  const [option, setOption] = useState(
    installMode === 'RPM' ? rpmArchitectureOptions[0].key : debArchitectureOptions[0].key
  );

  function Packaging() {
    return (
      <Stack direction="horizontal">
        <CheckboxFancy
          label={t('in-plg:agentDetails.agentMode.dynamic')}
          checked={agentMode === agentModeOptions[0]}
          onChange={() => setAgentMode(agentModeOptions[0])}
          size="default"
          asRadioButton
        />
        <CheckboxFancy
          label={t('in-plg:agentDetails.agentMode.static')}
          checked={agentMode === agentModeOptions[1]}
          onChange={() => setAgentMode(agentModeOptions[1])}
          size="default"
          asRadioButton
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
        <DropDown value={option} options={architectureOptions} onChange={setOption} />
        <Button
          target="_blank"
          icon="lib_actions_download"
          iconSize="s"
          kind="action"
          noAutoMargin
          href={getAgentDownloadURL(
            tenant,
            tenantUnit,
            agentKey,
            downloadKey,
            `${option}${agentMode === 'dynamic' ? '' : 'Static'}${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
              installMode === installModeOptions[0] ? 'Rpm' : 'Deb'
            }`,
            butlerDomain
          )}
        >
          {''}
        </Button>
      </Stack>
    );
  }

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host#network-requirements"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.linux.linux_deb_rpm.installUsingAPackage')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-linux#packages-installation-manual"
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

  function getRuntime() {
    return (
      <Stack direction="horizontal">
        <CheckboxFancy
          label="Azul Zulu 1.8"
          checked={jvmVendor === jvmVendorOptions[0]}
          onChange={() => setJVMVendor(jvmVendorOptions[0])}
          size="default"
          asRadioButton
        />
        <CheckboxFancy
          label="Eclipse OpenJ9 11"
          checked={jvmVendor === jvmVendorOptions[1]}
          onChange={() => setJVMVendor(jvmVendorOptions[1])}
          size="default"
          asRadioButton
        />
      </Stack>
    );
  }

  function getInstallationMode() {
    return (
      <Stack direction="horizontal">
        <CheckboxFancy
          label={t('in-waiting-for-deployment:content.agentInstallationModeRpm')}
          checked={installMode === installModeOptions[0]}
          onChange={() => {
            setInstallMode(installModeOptions[0]);
            setOption(rpmArchitectureOptions[0].key);
          }}
          size="default"
          asRadioButton
        />
        <CheckboxFancy
          label={t('in-waiting-for-deployment:content.agentInstallationModeDeb')}
          checked={installMode === installModeOptions[1]}
          onChange={() => {
            setInstallMode(installModeOptions[1]);
            setOption(debArchitectureOptions[0].key);
          }}
          size="default"
          asRadioButton
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

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_deb_rpm.ConfigureTheAgent')}>
          <Stack>
            <KeyValue label={t('in-plg:agentDetails.common.packaging')} value={Packaging()} withGap />
            <KeyValue label={t('in-plg:agentDetails.common.runtime')} value={getRuntime()} withGap />
            <KeyValue label={t('in-plg:agentDetails.linux.linux_deb_rpm.mode')} value={getInstallationMode()} withGap />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_deb_rpm.selectThePlatformArchitecture')}>
          <KeyValue
            label={t('in-plg:agentDetails.linux.linux_deb_rpm.platformArchitecture')}
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
}
