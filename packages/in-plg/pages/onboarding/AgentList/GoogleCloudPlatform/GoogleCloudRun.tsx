/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton } from '@instana/components';

import {
  documentationCloudNativeBuildPack,
  documentationRuntimes
} from 'in-plg/pages/onboarding/AgentList/GoogleCloudPlatform/SupportView';
import { GoPythonRuntimeContent } from 'in-plg/pages/onboarding/AgentList/Runtimes/GoPythonRuntimeContent';
import JavaRuntimeContent from 'in-plg/pages/onboarding/AgentList/Runtimes/JavaRuntimeContent';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import DotnetRuntime from 'in-plg/pages/onboarding/AgentList/Runtimes/DotnetRuntime';
import NodeJsRuntime from 'in-plg/pages/onboarding/AgentList/Runtimes/NodeJsRuntime';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

interface RuntimeOption {
  key: 'Go' | 'Java' | 'Dotnet' | 'NodeJs' | 'Python';
  label: string;
}

interface InstallationOption {
  key: 'DockerBuild' | 'CloudNativeBuildPack';
  label: string;
}

const runtimeOptions: RuntimeOption[] = [
  { key: 'Go', label: t('in-plg:agentDetails.runtime.go') },
  { key: 'Java', label: t('in-plg:agentDetails.runtime.java') },
  { key: 'Dotnet', label: t('in-plg:agentDetails.runtime.dotnet') },
  { key: 'NodeJs', label: t('in-plg:agentDetails.runtime.nodejs') },
  { key: 'Python', label: t('in-plg:agentDetails.runtime.python') }
];

const installationOptions: InstallationOption[] = [
  { key: 'DockerBuild', label: t('in-plg:agentDetails.gcp.dockerBuild') },
  { key: 'CloudNativeBuildPack', label: t('in-plg:agentDetails.gcp.cloudNativeBuildPack') }
];

export default function GoogleCloudRun({
  id,
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  downloadKey,
  instanaDomain,
  serverlessEndpoint,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const [installationMode, setInstallationMode] = useState<InstallationOption>(installationOptions[0]);

  const [selectedRuntime, setRuntime] = useState<RuntimeOption>(runtimeOptions[0]);

  const supportViewData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: (
        <Stack direction="vertical" gap="small">
          <DocumentLink
            text={t('in-plg:agentDetails.aws.prerequisiteLinks.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </Stack>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body:
        installationMode.key === 'CloudNativeBuildPack'
          ? documentationCloudNativeBuildPack()
          : documentationRuntimes(selectedRuntime.key),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  if (shareAndInviteEnabled) supportViewData.pop();

  function installationMethod() {
    return (
      <Stack direction="horizontal">
        <RadioButton
          label={installationOptions[0].label}
          checked={installationMode.key === installationOptions[0].key}
          onChange={() => setInstallationMode(installationOptions[0])}
          size="default"
        />
        <RadioButton
          label={installationOptions[1].label}
          checked={installationMode.key === installationOptions[1].key}
          onChange={() => setInstallationMode(installationOptions[1])}
          size="default"
        />
      </Stack>
    );
  }

  function RenderRuntimeView(): JSX.Element {
    switch (selectedRuntime.key) {
      case 'Go':
        return (
          <GoPythonRuntimeContent
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
          />
        );
      case 'Java':
        return (
          <JavaRuntimeContent
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
            instanaDomain={instanaDomain}
          />
        );
      case 'Dotnet':
        return (
          <DotnetRuntime
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
          />
        );
      case 'NodeJs':
        return (
          <NodeJsRuntime
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
          />
        );
      case 'Python':
        return (
          <GoPythonRuntimeContent
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
          />
        );
      default:
        return (
          <JavaRuntimeContent
            id={id}
            downloadKey={downloadKey}
            type="gcp"
            agentKey={agentKey}
            agentEndpoint={agentEndpoint}
            agentEndpointPort={agentEndpointPort}
            serverlessEndpoint={serverlessEndpoint}
          />
        );
    }
  }

  const handleRuntimeChange = (selectedValue: string) => {
    const selectedRuntimeOption = runtimeOptions.find(option => option.key === selectedValue);
    if (selectedRuntimeOption) {
      setRuntime(selectedRuntimeOption);
    }
  };

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.gcp.selectInstallationMethod')}>
          <Stack>
            <KeyValue label={t('in-plg:agentDetails.gcp.installationMethod')} value={installationMethod()} withGap />
            {installationMode.key === installationOptions[0].key && (
              <>
                <KeyValue
                  label={t('in-plg:agentDetails.gcp.applicationRuntime')}
                  value={<DropDown value={selectedRuntime} options={runtimeOptions} onChange={handleRuntimeChange} />}
                  withGap
                />
              </>
            )}
          </Stack>
        </LayoutSection>

        {installationMode.key === installationOptions[0].key ? (
          <RenderRuntimeView />
        ) : (
          <>
            <LayoutSection title={t('in-plg:agentDetails.gcp.reviewInfoStep')}>
              <Stack>
                <Code
                  lang="bash"
                  code={[
                    `echo '${downloadKey}' | docker login --username "_" --password-stdin containers.instana.${instanaDomain}`,
                    `pack build <image-name> --buildpack from=builder --buildpack containers.instana.${instanaDomain}/instana/release/google/buildpack --builder gcr.io/buildpacks/builder`
                  ]}
                />
              </Stack>
            </LayoutSection>
            <LayoutSection
              title={
                t('in-plg:agentDetails.aws.step3') +
                t('in-plg:agentDetails.gcp.setEnvVariablesInCloudRunServiceRevision')
              }
            >
              <Stack direction="horizontal">
                <KeyValue
                  label={'INSTANA_ENDPOINT_URL'}
                  value={<InputWithButton type="copy" inputValue={agentEndpoint + ':' + agentEndpointPort} />}
                  withGap
                />
                <KeyValue
                  label={'INSTANA_AGENT_KEY'}
                  value={<InputWithButton type="copy" inputValue={agentKey} />}
                  withGap
                />
              </Stack>
            </LayoutSection>
          </>
        )}

        <GetDeployedAgents agent="entity.type%3Agcp.cloudrun" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
}
