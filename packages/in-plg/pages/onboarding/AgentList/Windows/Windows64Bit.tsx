/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { region } from 'in-services/config';
import { t } from 'in-i18n';

const Windows64Bit = ({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) => {
  const agentModeOptions = ['dynamic', 'static'];
  const jvmVendorOptions = ['azul', 'eclipse'];

  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);
  const [href, setHref] = useState('');

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.windows.common.previewPrerequisites')}
            href="https://ibm.biz/insta-agent-win-prereqs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.windows.common.supportedOperatingSystemsAndPlatformArchitectures')}
            href="https://ibm.biz/insta-agent-win-ospa"
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
            text={t('in-plg:agentDetails.windows.windows_64_bit.installTheAgent')}
            href="https://ibm.biz/insta-agent-win-installer"
          />
        </>
      ),
      openByDefault: true
    }
  ];

  useEffect(() => {
    let option = `exe64${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
      agentMode === agentModeOptions[0] ? '' : 'offline'
    }`;

    let link = `https://${butlerDomain}/assets/agent/${tenant}/${tenantUnit}?agentKey=${encodeURIComponent(
      agentKey
    )}&downloadKey=${encodeURIComponent(downloadKey)}&type=${encodeURIComponent(option)}${
      region ? `&region=${encodeURIComponent(region)}` : ''
    }`;

    setHref(link);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, tenantUnit, agentKey, downloadKey, butlerDomain, agentMode, jvmVendor]);

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

  function getRuntime() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label="Azul Zulu 11"
          checked={jvmVendor === jvmVendorOptions[0]}
          onChange={() => setJVMVendor(jvmVendorOptions[0])}
          size="default"
        />
        <RadioButton
          label="Eclipse OpenJ9 11"
          checked={jvmVendor === jvmVendorOptions[1]}
          onChange={() => setJVMVendor(jvmVendorOptions[1])}
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

        <LayoutSection title={t('in-plg:agentDetails.windows.common.ConfigureTheAgent')}>
          <Stack>
            <KeyValue label={t('in-plg:agentDetails.windows.common.packaging')} value={getPackaging()} withGap />
            <KeyValue label={t('in-plg:agentDetails.windows.common.runtime')} value={getRuntime()} withGap />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_64_bit.downloadTheLatestWindowsInstaller')}>
          <KeyValue
            label={t('in-plg:agentDetails.windows.windows_64_bit.agentInstaller')}
            value={
              <Stack direction="horizontal" align="center">
                <InputWithButton type="download" href={href} inputValue="instana-agent-windows-64bit.exe" />
              </Stack>
            }
            withGap
          />
        </LayoutSection>

        <LayoutSection
          title={t(
            'in-plg:agentDetails.windows.windows_64_bit.launchTheInstallerAsAnApplicationAndSupplyTheConfigurationBelow'
          )}
        >
          <Stack direction="vertical">
            <Stack direction="horizontal">
              <KeyValue
                label={t('in-plg:agentDetails.windows.windows_64_bit.instanaBackendAddress')}
                value={<InputWithButton type="copy" inputValue={agentEndpoint} />}
                withGap
              />

              <KeyValue
                label={t('in-plg:agentDetails.windows.windows_64_bit.instanaBackendPort')}
                value={<InputWithButton type="copy" inputValue={agentEndpointPort} />}
                withGap
              />
            </Stack>
            <Stack direction="horizontal">
              <KeyValue
                label={t('in-plg:agentDetails.windows.windows_64_bit.instanaAgentKey')}
                value={<InputWithButton type="copy" inputValue={agentKey} />}
                withGap
              />

              <KeyValue
                label={t('in-plg:agentDetails.windows.windows_64_bit.downloadkey')}
                value={<InputWithButton type="copy" inputValue={downloadKey} />}
                withGap
              />
            </Stack>
          </Stack>
        </LayoutSection>

        <GetDeployedAgents agent="windows" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default Windows64Bit;
