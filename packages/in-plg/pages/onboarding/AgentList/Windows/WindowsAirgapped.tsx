/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import { t } from 'in-i18n';

const WindowsAirGappedInstalls = ({ downloadKey, instanaDomain, fromOnboarding }: OnboardingProps) => {
  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/install-host-agent-network-reqs"
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
            text={t('in-plg:agentDetails.windows.windows_airgapped.installUsingAPackageOrArchive')}
            href="https://ibm.biz/install-host-agent-windows"
          />
        </Stack>
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

        <LayoutSection
          title={t('in-plg:agentDetails.windows.windows_airgapped.step1DownloadTheInstallPackageOrArchive')}
        >
          <KeyValue
            label={t('in-plg:agentDetails.windows.windows_airgapped.airgappedPackagesOrArchive')}
            value={
              <InputWithButton
                type="copy"
                size="large"
                inputValue={`https://_:${downloadKey}@packages.instana.${instanaDomain}/agent/download`}
              />
            }
            withGap
          />
        </LayoutSection>

        <GetDeployedAgents agent="windows" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default WindowsAirGappedInstalls;
