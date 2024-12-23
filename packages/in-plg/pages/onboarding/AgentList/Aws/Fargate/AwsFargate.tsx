/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Typography, KeyValue } from '@instana/components';

import { GoPythonRuntimeContent } from 'in-plg/pages/onboarding/AgentList/Runtimes/GoPythonRuntimeContent';
import { documentations, prerequisites } from 'in-plg/pages/onboarding/AgentList/Aws/Fargate/SupportView';
import JavaRuntimeContent from 'in-plg/pages/onboarding/AgentList/Runtimes/JavaRuntimeContent';
import OnboardingExpandCard from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import DotnetRuntime from 'in-plg/pages/onboarding/AgentList/Runtimes/DotnetRuntime';
import NodeJsRuntime from 'in-plg/pages/onboarding/AgentList/Runtimes/NodeJsRuntime';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import { DropDown } from 'in-plg/pages/onboarding/content/ContentComponents';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { t } from 'in-i18n';

interface RuntimeOption {
  key: 'Go' | 'Java' | 'Dotnet' | 'NodeJs' | 'Python' | 'Ruby';
  label: string;
}

export default function AwsFargate({
  id,
  downloadKey,
  agentKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  serverlessEndpoint,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const runtimeOptions: RuntimeOption[] = [
    { key: 'Go', label: t('in-plg:agentDetails.runtime.go') },
    { key: 'Java', label: t('in-plg:agentDetails.runtime.java') },
    { key: 'Dotnet', label: t('in-plg:agentDetails.runtime.dotnet') },
    { key: 'NodeJs', label: t('in-plg:agentDetails.runtime.nodejs') },
    { key: 'Python', label: t('in-plg:agentDetails.runtime.python') },
    { key: 'Ruby', label: t('in-plg:agentDetails.runtime.ruby') }
  ];
  const [selectedRuntime, setRuntime] = useState<RuntimeOption>(runtimeOptions[0]);

  function renderRuntimeView() {
    switch (selectedRuntime.key) {
      case 'Go':
        return (
          <GoPythonRuntimeContent
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              agentEndpoint,
              agentEndpointPort,
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
              type: 'aws',
              agentKey,
              serverlessEndpoint,
              instanaDomain
            }}
          />
        );
      case 'Dotnet':
        return (
          <DotnetRuntime
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              serverlessEndpoint
            }}
          />
        );
      case 'NodeJs':
        return (
          <NodeJsRuntime
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              serverlessEndpoint
            }}
          />
        );
      case 'Python':
        return (
          <GoPythonRuntimeContent
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              serverlessEndpoint
            }}
          />
        );
      case 'Ruby':
        return (
          <GoPythonRuntimeContent
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              serverlessEndpoint
            }}
          />
        );
      default:
        return (
          <JavaRuntimeContent
            {...{
              id,
              downloadKey,
              type: 'aws',
              agentKey,
              serverlessEndpoint,
              instanaDomain
            }}
          />
        );
    }
  }

  const supportViewData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: prerequisites(selectedRuntime.key),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: documentations(selectedRuntime.key),
      openByDefault: true
    }
  ];

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

        <LayoutSection title={t('in-plg:agentDetails.aws.selectApplicationRunime')}>
          <KeyValue
            label={t('in-plg:agentDetails.aws.applicationRuntime')}
            value={<DropDown value={selectedRuntime.key} options={runtimeOptions} onChange={handleRuntimeChange} />}
            withGap
          />
        </LayoutSection>

        {renderRuntimeView()}

        <GetDeployedAgents agent="fargate" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <Typography variant="body-bold">Support</Typography>
        <>
          {supportViewData.map((sideCard, index) => (
            <OnboardingExpandCard
              key={index}
              title={sideCard.title}
              body={sideCard.body}
              openByDefault={sideCard.openByDefault}
            />
          ))}
        </>
      </SidePanel>
    </Container>
  );
}
