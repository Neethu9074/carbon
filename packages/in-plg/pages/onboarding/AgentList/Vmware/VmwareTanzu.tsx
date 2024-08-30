/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';

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

export default function VmwareTanzu({
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  downloadKey,
  fromOnboarding
}: OnboardingProps): JSX.Element {
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
            text={t('in-plg:agentDetails.tanzu.reviewThePrerequisites')}
            href="https://ibm.biz/insta-agent-vmtanzu-prereqs"
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
            text={t('in-plg:agentDetails.tanzu.installingTheInstanaAgent')}
            href="https://ibm.biz/insta-agent-vmtanzu-install"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.tanzu.installingAndConfiguringMicroservicesApplicationsMonitoring')}
            href="https://ibm.biz/insta-agent-vmtanzu-docs"
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

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={
            t('in-plg:agentDetails.common.step1') +
            t('in-plg:agentDetails.tanzu.downloadInstanaMonitoringApplicationMonitoring')
          }
        >
          <KeyValue
            label={t('in-plg:agentDetails.tanzu.vmwareTanzuNetworkLink')}
            value={
              <InputWithButton
                type="copy"
                inputValue={
                  'https://support.broadcom.com/group/ecx/productdownloads?subfamily=Instana%20Microservices%20Application%20Monitoring%20for%20VMware%20Tanzu'
                }
              />
            }
            withGap
          />
        </LayoutSection>

        <LayoutSection
          title={
            t('in-plg:agentDetails.common.step2') + t('in-plg:agentDetails.tanzu.addTileToOpsManagerAndConfigureIt')
          }
        >
          <Stack direction="horizontal">
            <Stack direction="vertical">
              <Typography variant="body-regular">
                {t('in-plg:agentDetails.tanzu.addInstanaApplicationMonitoring')}
              </Typography>
              <Stack direction="horizontal">
                <KeyValue
                  label={t('in-plg:agentDetails.aws.instanaEndpointUrl')}
                  value={<InputWithButton type="copy" inputValue={agentEndpoint} />}
                  withGap
                />
                <KeyValue
                  label={t('in-plg:agentDetails.aws.instanaEndpointPort')}
                  value={<InputWithButton type="copy" inputValue={agentEndpointPort} />}
                  withGap
                />
              </Stack>
              <Stack direction="horizontal">
                <KeyValue
                  label={t('in-plg:agentDetails.common.agentKey')}
                  value={<InputWithButton type="copy" inputValue={agentKey} />}
                  withGap
                />
                <KeyValue
                  label={t('in-plg:agentDetails.common.downloadKey')}
                  value={<InputWithButton type="copy" inputValue={downloadKey} />}
                  withGap
                />
              </Stack>
            </Stack>
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.common.step3') + t('in-plg:agentDetails.tanzu.nameYourVmwareFoundation')}
        >
          <Typography variant="body-regular">
            {t('in-plg:agentDetails.tanzu.assignANameToVMwareTanzuFoundation')}
          </Typography>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.common.step4') + t('in-plg:agentDetails.tanzu.applyTileChanges')}>
          <Typography variant="body-regular">
            {t('in-plg:agentDetails.tanzu.applyTheChangesMadeWithinThisTile')}
          </Typography>
        </LayoutSection>

        <GetDeployedAgents agent="pcf" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
