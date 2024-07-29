/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Typography, KeyValue } from '@instana/components';

import NodeJs10RuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/NodeJs10RuntimeContent';
import NodeJs8RuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/NodeJs8RuntimeContent';
import PythonRuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/PythonRuntimeContent';
import DotnetRuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/DotnetRuntimeContent';
import RubyRuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/RubyRuntimeContent';
import JavaRuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/JavaRuntimeContent';
import GoRuntimeContent from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/LambdaRuntimes/GoRuntimeContent';
import { Documentations, Prerequisites } from 'in-plg/pages/onboarding/AgentList/Aws/Lambda/SupportView';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

interface RuntimeOption {
  key: 'Go' | 'Java' | 'NodeJs10' | 'NodeJs8' | 'Python' | 'Ruby' | 'Dotnet';
  label: string;
}

const runtimeOptions: RuntimeOption[] = [
  { key: 'Dotnet', label: t('in-plg:agentDetails.runtime.dotnet') },
  { key: 'Go', label: t('in-plg:agentDetails.runtime.go') },
  { key: 'Java', label: t('in-plg:agentDetails.runtime.java') },
  { key: 'NodeJs10', label: t('in-plg:agentDetails.runtime.nodejs10Plus') },
  { key: 'NodeJs8', label: t('in-plg:agentDetails.runtime.nodejs8') },
  { key: 'Python', label: t('in-plg:agentDetails.runtime.python2and3') },
  { key: 'Ruby', label: t('in-plg:agentDetails.runtime.ruby') }
];

export default function AwsLambda({
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
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  if (shareAndInviteEnabled) supportViewData.pop();

  function RenderRuntimeView(): JSX.Element {
    switch (selectedRuntime.key) {
      case 'Dotnet':
        return (
          <DotnetRuntimeContent
            {...{
              id,
              downloadKey,
              agentKey,
              instanaDomain,
              serverlessEndpoint
            }}
          />
        );
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
      case 'Java':
        return (
          <JavaRuntimeContent
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
      case 'NodeJs10':
        return (
          <NodeJs10RuntimeContent
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
      case 'NodeJs8':
        return <NodeJs8RuntimeContent />;
      case 'Python':
        return (
          <PythonRuntimeContent
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
      case 'Ruby':
        return (
          <RubyRuntimeContent
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

        <LayoutSection title={t('in-plg:agentDetails.aws.step1') + t('in-plg:agentDetails.aws.selectLambdaRuntime')}>
          <KeyValue
            label={t('in-plg:agentDetails.aws.applicationRuntime')}
            value={<DropDown value={selectedRuntime.key} options={runtimeOptions} onChange={handleRuntimeChange} />}
            withGap
          />
        </LayoutSection>

        <RenderRuntimeView />

        <GetDeployedAgents agent="entity.type%3Alambda" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={supportViewData} />
      </SidePanel>
    </Container>
  );
}
