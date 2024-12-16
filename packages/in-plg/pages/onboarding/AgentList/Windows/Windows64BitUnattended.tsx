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
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { CodeProps } from 'in-plg/components/Code/Code';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

import locals from './Windows64BitUnattended.mless';

const agentModeOptions = ['dynamic', 'static'];
const jvmVendorOptions = ['azul', 'eclipse'];

const Windows64BitUnattended = ({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) => {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);
  const [jvmVendor, setJVMVendor] = useState(jvmVendorOptions[0]);

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
            text={t('in-plg:agentDetails.windows.windows_64_bit_unattended.installTheAgent')}
            href="https://ibm.biz/insta-agent-win-installer"
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

  const cmdLine = (agentMode: string, jvmVendor: string): CodeProps => {
    let fileName = 'instana-agent-windows-64bit';
    if (jvmVendor === jvmVendorOptions[1]) fileName += '-j9';
    if (agentMode === agentModeOptions[1]) fileName += '-offline';
    fileName += '.exe';
    return {
      code: [
        '@ECHO OFF',
        '',
        `${fileName} INSTANA_AGENT_ENDPOINT=${agentEndpoint} INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort} INSTANA_AGENT_KEY=${agentKey} INSTANA_DOWNLOAD_KEY=${downloadKey} /quiet`
      ],
      lang: 'bash',
      withoutCopyButton: !(!!agentEndpoint && !!agentEndpointPort && !!agentKey && !!downloadKey)
    };
  };

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

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_64_bit_unattended.downloadTheWindowsInstaller')}>
          <Stack>
            <Typography variant="body-regular">
              {t(
                'in-plg:agentDetails.windows.windows_64_bit_unattended.theLatestWindowsInstallerIsAvailableAtTheFollowingAddress'
              )}
            </Typography>
            <KeyValue
              className={locals.keyValueInput}
              label={t('in-plg:agentDetails.windows.windows_64_bit_unattended.windowsInstaller')}
              value={
                <Stack>
                  <InputWithButton
                    type="copy"
                    inputValue={getAgentDownloadURL(
                      tenant,
                      tenantUnit,
                      agentKey,
                      downloadKey,
                      `exe64${jvmVendor === jvmVendorOptions[0] ? '' : 'j9'}${
                        agentMode === agentModeOptions[0] ? '' : 'offline'
                      }`,
                      butlerDomain
                    )}
                  />
                </Stack>
              }
              withGap
            />
            <Typography variant="body-regular">
              {t(
                'in-plg:agentDetails.windows.windows_64_bit_unattended.theFollowingCommandLineInstallationWillInstallTheInstanaAgent'
              )}
            </Typography>
            <Code {...cmdLine(agentMode, jvmVendor)} />
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

export default Windows64BitUnattended;
