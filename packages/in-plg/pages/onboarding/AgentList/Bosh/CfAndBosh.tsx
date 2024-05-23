/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';
import React from 'react';

import { Stack, Typography, KeyValue } from '@instana/components';

import { ValidatedInputFields } from 'in-plg/pages/onboarding/content/ContentComponents';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { clusterNameValidator } from 'in-plg/pages/onboarding/content/validators';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Code from 'in-plg/components/Code/Code';
import { t, Trans } from 'in-i18n';

const runtimeConfig = ({
  agentReleaseVersion,
  foundationName,
  agentKey,
  agentEndpoint,
  clientId,
  clientSecret
}: {
  agentReleaseVersion: string;
  foundationName: string;
  agentKey: string;
  agentEndpoint: string;
  clientId: string;
  clientSecret: string;
}) => {
  return (
    `releases:\n` +
    `- name: instana-agent\n` +
    `  version: ${agentReleaseVersion}\n` +
    `- name: instana-leadership-election\n` +
    `  version: ${agentReleaseVersion}\n` +
    `addons:\n` +
    `- name: instana-agent\n` +
    `  jobs:\n` +
    `  - name: instana-agent\n` +
    `    release: instana-agent\n` +
    `  properties:\n` +
    `    tanzu:\n` +
    `      foundation:\n` +
    `        id: '${foundationName}'\n` +
    `        name: '${foundationName}'\n` +
    `    instana:\n` +
    `      agent:\n` +
    `        mode: APM\n` +
    `        key: '${agentKey}'\n` +
    `        endpoint: '${agentEndpoint}'\n` +
    `        zone: '${foundationName}'\n` +
    `- name: instana-cloudfoundry-sensor\n` +
    `  jobs:\n` +
    `  - name: instana-agent-configuration-cf-sensor\n` +
    `    release: instana-agent\n` +
    `    properties:\n` +
    `      tanzu:\n` +
    `        foundation:\n` +
    `          id: '${foundationName}'\n` +
    `          name: '${foundationName}'\n` +
    `      cf:\n` +
    `        uaa:\n` +
    `          client: '${clientId}'\n` +
    `          client_secret: '${clientSecret}'\n` +
    `  - name: instana-leadership-election\n` +
    `    release: instana-leadership-election\n` +
    `- name: instana-agent-configuration-pxc-mysql\n` +
    `  jobs:\n` +
    `  - name: instana-agent-configuration-pxc-mysql\n` +
    `    release: instana-agent\n` +
    `  include:\n` +
    `    lifecycle: service\n` +
    `    jobs:\n` +
    `    - name: pxc-mysql\n` +
    `      release: pxc\n`
  );
};

export default function CfAndBosh({
  agentKey,
  agentEndpoint,
  downloadKey,
  instanaDomain,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const agentReleaseVersionRegex = new RegExp(/^\d\.\d{1,3}\.\d+$/);

  function validateAgentReleaseVersion(agentReleaseVersion: string): ValidationResult {
    if (!agentReleaseVersionRegex.test(agentReleaseVersion)) {
      return [
        {
          severity: 'error',
          message: t('in-waiting-for-deployment:content.theAgentReleaseVersionMustBeAValidSemanticVersion')
        }
      ];
    }
    return null;
  }

  function validateNotEmpty(value: string, message: string): ValidationResult {
    if (!value) {
      return [
        {
          severity: 'error',
          message: message
        }
      ];
    }
    return null;
  }

  const supportViewData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.unix.previewPrerequisites')}
            href="https://ibm.biz/insta-agent-cfbosh-prereqs"
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
            text={t('in-plg:agentDetails.bosh.deployingTheInstanaAgent')}
            href="https://ibm.biz/insta-agent-cfbosh-deploy"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.bosh.configuringTheCloudFoundrySensor')}
            href="https://ibm.biz/insta-agent-cfbosh-cfsensor"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.bosh.boshDirectorRuntimeConfig')}
            href="https://ibm.biz/insta-agent-cfbosh-runtime-cfg"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.bosh.cloudFoundryUAACTool')}
            href="https://ibm.biz/insta-agent-cfbosh-uaactool"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.bosh.instanaBOSHArtifcatory')}
            href="https://ibm.biz/insta-agent-cfbosh-artifactory"
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

  if (shareAndInviteEnabled) supportViewData.pop();

  return (
    <>
      <ValidatedInputFields
        fields={[
          {
            name: 'agentReleaseVersion',
            placeholder: t('in-plg:agentDetails.bosh.placeholderReleaseVersionEG001'),
            validate: validateAgentReleaseVersion
          },
          {
            name: 'foundationName',
            placeholder: t('in-plg:agentDetails.bosh.placeholderFoundationNameEGProd'),
            validate: clusterNameValidator
          },
          {
            name: 'clientId',
            placeholder: t('in-plg:agentDetails.bosh.placeholderUaaClientIdEGMyClientId'),
            validate: str => {
              return validateNotEmpty(str, t('in-plg:agentDetails.bosh.theUaaClientIdCannotBeBlank'));
            }
          },
          {
            name: 'clientSecret',
            placeholder: t('in-plg:agentDetails.bosh.placeholderUaaClientSecretEGMyClientSecret'),
            validate: str => validateNotEmpty(str, t('in-plg:agentDetails.bosh.theUaaClientSecretCannotBeBlank'))
          }
        ]}
        renderContent={({
          foundationName,
          foundationNameInput,
          agentReleaseVersion,
          agentReleaseVersionInput,
          clientId,
          clientIdInput,
          clientSecret,
          clientSecretInput
        }) => {
          return (
            <Container>
              <MainBody>
                <Typography variant="body-regular">
                  {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
                </Typography>

                <LayoutSection
                  title={
                    t('in-plg:agentDetails.common.step1') +
                    t('in-plg:agentDetails.bosh.specifyDesiredBoshReleaseVersion')
                  }
                >
                  <KeyValue
                    label={t('in-plg:agentDetails.bosh.releaseVersion')}
                    value={agentReleaseVersionInput}
                    withGap
                  />
                </LayoutSection>

                <LayoutSection
                  title={t('in-plg:agentDetails.common.step2') + t('in-plg:agentDetails.bosh.downloadBoshReleases')}
                >
                  <Stack direction="horizontal">
                    <InputWithButton
                      type="download"
                      href={`https://_:${downloadKey}@artifact-public.instana.${instanaDomain}/artifactory/rel-generic-instana-virtual/com/instana/bosh/agent-bosh/${agentReleaseVersion}/agent-bosh-${agentReleaseVersion}.tar.gz`}
                      inputValue={"'instana-agent' release"}
                    />
                    <InputWithButton
                      type="download"
                      href={`https://_:${downloadKey}@artifact-public.instana.${instanaDomain}/artifactory/rel-generic-instana-virtual/com/instana/bosh/leadership-election/${agentReleaseVersion}/leadership-election-${agentReleaseVersion}.tar.gz`}
                      inputValue={"'instana-leadership-election' release"}
                    />
                  </Stack>
                </LayoutSection>

                <LayoutSection
                  title={
                    t('in-plg:agentDetails.common.step3') +
                    t('in-plg:agentDetails.bosh.uploadBOSHReleasesToBOSHDirector')
                  }
                >
                  <Code
                    lang="bash"
                    code={[
                      `bosh upload-release agent-bosh-${agentReleaseVersion}.tar.gz`,
                      `bosh upload-release leadership-election-${agentReleaseVersion}.tar.gz`
                    ]}
                  />
                </LayoutSection>

                <LayoutSection
                  title={t('in-plg:agentDetails.common.step4') + t('in-plg:agentDetails.bosh.createInstanaUAAClient')}
                >
                  <Stack>
                    <Stack direction="horizontal">
                      <Stack direction="vertical">
                        <Typography variant="body-regular">
                          <Trans
                            i18nKey={'in-plg:agentDetails.bosh.createInstanaUAAClientDesc'}
                            components={{
                              uaacTool: <a href="test-url" rel="noopener noreferrer" target="_blank" />
                            }}
                          />
                        </Typography>
                        <Stack direction="horizontal">
                          <KeyValue label={t('in-plg:agentDetails.bosh.uaaClientId')} value={clientIdInput} withGap />
                          <KeyValue
                            label={t('in-plg:agentDetails.bosh.uaaClientSecret')}
                            value={clientSecretInput}
                            withGap
                          />
                        </Stack>
                        <Typography variant="body-regular">
                          {t('in-plg:agentDetails.bosh.replaceTheCommandsBelow')}{' '}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Code
                      lang="bash"
                      code={[
                        `uaac target <uaa-api-endpoint>`,
                        `uaac token client get -s <clients.admin-secret>`,
                        `uaac client add '${clientId}' \\`,
                        `  --name 'Instana Cloud Foundry Client' \\`,
                        `  --autoapprove true \\`,
                        `  --authorized_grant_types client_credentials \\`,
                        `  --authorities 'cloud_controller.admin_read_only' \\`,
                        `  --secret '${clientSecret}' \\`
                      ]}
                    />
                  </Stack>
                </LayoutSection>

                <LayoutSection
                  title={t('in-plg:agentDetails.common.step5') + t('in-plg:agentDetails.bosh.configureBoshAddons')}
                >
                  <Stack direction="horizontal">
                    <Stack direction="vertical">
                      <Typography variant="body-regular">
                        {t('in-plg:agentDetails.bosh.chooseNameForCloudFoundryFoundation')}
                      </Typography>
                      <KeyValue
                        label={t('in-plg:agentDetails.bosh.cloudFoundryFoundationName')}
                        value={foundationNameInput}
                        withGap
                      />
                      <Typography variant="body-regular">
                        {t('in-plg:agentDetails.bosh.applyFollowingRuntimeConfigurations')}
                      </Typography>
                      <InputWithButton
                        type="copy"
                        inputValue={runtimeConfig({
                          agentReleaseVersion: agentReleaseVersion,
                          foundationName: foundationName,
                          agentKey: agentKey,
                          agentEndpoint: agentEndpoint || '',
                          clientId: clientId,
                          clientSecret: clientSecret
                        })}
                        displayContent={'runtimeConfig.yaml'}
                      />
                    </Stack>
                  </Stack>
                </LayoutSection>

                <GetDeployedAgents agent="bosh" fromOnboarding={fromOnboarding} />
              </MainBody>
              <SidePanel>
                <SupportViewSection items={supportViewData} />
              </SidePanel>
            </Container>
          );
        }}
      />
    </>
  );
}
