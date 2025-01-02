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
import { t } from 'in-i18n';

const WindowsZipArchive = ({
  tenant,
  tenantUnit,
  agentKey,
  downloadKey,
  butlerDomain,
  fromOnboarding
}: OnboardingProps) => {
  const agentModeOptions = ['dynamic', 'static'];

  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

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
          <DocumentLink
            text={t('in-plg:agentDetails.windows.windows_zip.installingTheJDK')}
            href="https://ibm.biz/insta-agent-win-installjdk"
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
            text={t('in-plg:agentDetails.windows.windows_zip.installTheAgent')}
            href="https://ibm.biz/insta-agent-win-zip"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.windows.windows_zip.hostAgentTypes')}
            href="https://ibm.biz/insta-host-agent-types"
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

        <LayoutSection title={t('in-plg:agentDetails.windows.windows_zip.selectAgentPackagingMode')}>
          <KeyValue
            label={t('in-plg:agentDetails.windows.common.packaging')}
            value={
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
            }
            withGap
          />
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.windows.windows_zip.selectPlatformArchitectureReviewThePrerequisites')}
        >
          <Stack>
            <InputWithButton
              type="download"
              href={getAgentDownloadURL(
                tenant,
                tenantUnit,
                agentKey,
                downloadKey,
                agentMode === agentModeOptions[0] ? 'win32' : 'win32offline',
                butlerDomain
              )}
              inputValue="Windows Zip (32bit)"
            />
            <InputWithButton
              type="download"
              href={getAgentDownloadURL(
                tenant,
                tenantUnit,
                agentKey,
                downloadKey,
                agentMode === agentModeOptions[0] ? 'win64' : 'win64offline',
                butlerDomain
              )}
              inputValue="Windows Zip (64bit)"
            />
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

export default WindowsZipArchive;
