/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Typography, KeyValue } from '@instana/components';

import NodeJsRuntimeContent from 'in-plg/pages/onboarding/AgentList/Azure/AppService/AppServiceRuntimes/NodeJsRuntimeContent';
import { Documentations, Prerequisites } from 'in-plg/pages/onboarding/AgentList/Azure/AppService/SupportView';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import DotNetRuntimeContent from './AppServiceRuntimes/DotNetRuntimeContent';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

interface RuntimeOption {
  key: 'Node.js' | '.NET';
  label: string;
}

const runtimeOptions: RuntimeOption[] = [
  { key: 'Node.js', label: t('in-plg:agentDetails.runtime.nodejs') },
  { key: '.NET', label: t('in-plg:agentDetails.runtime.dotnet') }
];

export default function AzureAppService({
  id,
  downloadKey,
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  serverlessEndpoint,
  fromOnboarding
}: Readonly<OnboardingProps>): JSX.Element {
  const [selectedRuntime, setRuntime] = useState(runtimeOptions[0]);

  // Support view data - dynamically generate content
  const supportViewData = [
    {
      id: 'prerequisites',
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: <Prerequisites runtime={selectedRuntime.key} />,
      openByDefault: true
    },
    {
      id: 'documentation',
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: <Documentations runtime={selectedRuntime.key} />,
      openByDefault: true
    }
  ];

  // Handle runtime selection
  const handleRuntimeChange = (selectedValue: string) => {
    const selectedRuntimeOption = runtimeOptions.find(option => option.key === selectedValue);
    if (selectedRuntimeOption) {
      setRuntime(selectedRuntimeOption);
    }
  };

  // Render runtime-specific content
  const renderRuntimeContent = () => {
    const sharedProps = { id, downloadKey, agentKey, instanaDomain, serverlessEndpoint };

    switch (selectedRuntime.key) {
      case 'Node.js':
        return <NodeJsRuntimeContent {...sharedProps} />;
      case '.NET':
        return <DotNetRuntimeContent {...sharedProps} />;
      default:
        return (
          <NodeJsRuntimeContent
            {...{
              ...sharedProps,
              agentEndpoint,
              agentEndpointPort
            }}
          />
        );
    }
  };

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={t('in-plg:agentDetails.common.step1') + t('in-plg:agentDetails.azure.selectAzureAppServiceRuntime')}
        >
          <KeyValue
            label={t('in-plg:agentDetails.common.applicationRuntime')}
            value={<DropDown value={selectedRuntime.key} options={runtimeOptions} onChange={handleRuntimeChange} />}
            withGap
          />
        </LayoutSection>

        {renderRuntimeContent()}

        <GetDeployedAgents agent="azure" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
}
