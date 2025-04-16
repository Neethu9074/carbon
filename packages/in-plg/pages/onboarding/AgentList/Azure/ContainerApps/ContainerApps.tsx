/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography, KeyValue } from '@instana/components';

import GoRuntimeContent from 'in-plg/pages/onboarding/AgentList/Azure/ContainerApps/ContainerAppsRuntimes/GoRuntimeContent';
import DotNetRuntimeContent from 'in-plg/pages/onboarding/AgentList/Azure/ContainerApps/ContainerAppsRuntimes/DotNetRuntimeContent';
import { Documentations, Prerequisites } from 'in-plg/pages/onboarding/AgentList/Azure/ContainerApps/SupportView';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

interface RuntimeOption {
  key: 'Go' | '.NET';
  label: string;
}

const runtimeOptions: RuntimeOption[] = [
  { key: 'Go', label: t('in-plg:agentDetails.runtime.go') },
  { key: '.NET', label: t('in-plg:agentDetails.runtime.dotnet') }
];

export default function AzureContainerApps({
  id,
  downloadKey,
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  serverlessEndpoint,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);

  const supportViewData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: <Prerequisites runtime={selectedRuntime.key} />,
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: <Documentations runtime={selectedRuntime.key} />,
      openByDefault: true
    }
  ];

  function RenderRuntimeView(): JSX.Element {
    switch (selectedRuntime.key) {
      case 'Go':
        return (
          <GoRuntimeContent
            {...{
              id,
              downloadKey,
              agentKey,
              instanaDomain,
              serverlessEndpoint
            }}
          />
        );
      case '.NET':
        return (
          <DotNetRuntimeContent
            {...{
              id,
              downloadKey,
              agentKey,
              instanaDomain,
              serverlessEndpoint
            }}
          />
        );
      default:
        return (
          <GoRuntimeContent
            {...{
              id,
              downloadKey,
              agentKey,
              agentEndpoint,
              agentEndpointPort,
              instanaDomain,
              serverlessEndpoint
            }}
          />
        );
    }
  }

  const handleRuntimeChange = (selectedValue: string) => {
    const selectedRuntimeOption = runtimeOptions.find(option => option.key === selectedValue as 'Go' | '.NET');
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

        <LayoutSection
          title={t('in-plg:agentDetails.common.step1') + t('in-plg:agentDetails.azure.selectAzureContainerAppsRuntime')}
        >
          <KeyValue
            label={t('in-plg:agentDetails.common.applicationRuntime')}
            value={<DropDown value={selectedRuntime.key} options={runtimeOptions} onChange={handleRuntimeChange} />}
            withGap
          />
        </LayoutSection>

        <RenderRuntimeView />

        <GetDeployedAgents agent="azure" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
}
