/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { t } from 'in-i18n';

const LinuxPackages = ({ agentKey, downloadKey, instanaDomain }: OnboardingProps) => {
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

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.linux.linux_deb_rpm.step1DownloadTheInstallPackage')}>
          <KeyValue
            // className={locals.keyValueInput}
            label={t('in-plg:agentDetails.linux.linux_deb_rpm.DEBAndRPMPackage')}
            value={
              <InputWithButton
                type="copy"
                inputValue={`https://_:${downloadKey}@packages.instana.${instanaDomain}/agent/download`}
              />
            }
            withGap
          />
        </LayoutSection>

        <GetDeployedAgents agent="linux" />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default LinuxPackages;
