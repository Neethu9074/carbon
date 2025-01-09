/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

import {
  getBashCode,
  getDocumentations,
  getPrerequisites
} from 'in-plg/pages/onboarding/AgentList/Openshift/AgentDetailsOpenshiftContent';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

export default function Openshift({
  id,
  agentKey,
  downloadKey,
  instanaDomain,
  agentEndpoint,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps): JSX.Element {
  const [clusterName, setClusterName] = useState<string>('');
  const [agentZone, setAgentZone] = useState<string>('');

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.prerequisitesTitle'),
      body: getPrerequisites(id),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: getDocumentations(id),
      openByDefault: true
    }
  ];

  const updateAgentZone = (agent: string) => {
    setAgentZone(agent);
  };

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection
          title={t('in-plg:agentDetails.openshift.instructions.enterAClusterNameAndOptionallyTheAgentZone')}
        >
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.common.clusterName')}
              value={<FormInputPlg onChange={value => setClusterName(value)} maxLength={65} />}
              withGap
            />
            <AgentzoneLister callBackFunc={updateAgentZone} />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.openshift.instructions.reviewPrerequisiteAndRunCode')}>
          <Code
            {...getBashCode({
              id: id,
              agentZone: agentZone,
              clusterName: clusterName,
              downloadKey: downloadKey,
              agentKey: agentKey,
              instanaDomain: instanaDomain,
              agentEndpoint: agentEndpoint,
              agentEndpointPort: agentEndpointPort
            })}
          />
        </LayoutSection>

        <GetDeployedAgents agent="openshift" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
