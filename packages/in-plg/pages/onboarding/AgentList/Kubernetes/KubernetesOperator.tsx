/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import AgentzoneLister from 'in-plg/components/AgentzoneLister/AgentzoneLister';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { Trans, t } from 'in-i18n';

interface BashCodeProps {
  agentZone: string;
  clusterName: string;
  downloadKey: string;
}

const KubernetesOperator = ({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  fromOnboarding
}: OnboardingProps): JSX.Element => {
  const [clusterName, setClusterName] = useState('');
  const [agentZone, setAgentZone] = useState('');

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.sideCard.prerequisites'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.common.choosingTheProperInstallationMethod')}
            href="https://ibm.biz/insta-agent-K8schoose"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://ibm.biz/insta-agent-netreqs"
          />
        </>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.sideCard.documentation'),
      body: (
        <>
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.operator.installUsingTheOperator')}
            href="https://ibm.biz/K8s-operator-install"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.operator.installAnAgentOnKubernetes')}
            href="https://ibm.biz/K8s-agent-install"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.configuringTheAgentAfterInstall')}
            href="https://ibm.biz/K8s-agent-administer"
          />
        </>
      ),
      openByDefault: true
    }
  ];

  const CODE_1 = [
    'kubectl apply -f https://github.com/instana/instana-agent-operator/releases/latest/download/instana-agent-operator.yaml'
  ];

  const CODE_2 = ({ agentZone, clusterName }: BashCodeProps): string[] => {
    let content = [];
    content.push(
      'apiVersion: instana.io/v1',
      'kind: InstanaAgent',
      'metadata:',
      '  name: instana-agent',
      '  namespace: instana-agent',
      'spec:'
    );
    if (agentZone) content.push('  zone:', `   name: ${agentZone} # (optional) name of the zone of the host`);
    content.push(
      '  cluster:',
      `   name: ${clusterName}`,
      '  agent:',
      `   key: ${agentKey}`,
      `   endpointHost: ${agentEndpoint}`,
      `   endpointPort: "${agentEndpointPort}"`,
      '   env: {}',
      '   configuration_yaml: |',
      '    # You can leave this empty, or use this to configure your instana agent.',
      '    # See https://ibm.biz/K8s-agent-administer'
    );
    return content;
  };

  const CODE_3 = ['kubectl apply -f instana-agent.customresource.yaml'];

  const updateAgentZone = (agent: string) => {
    setAgentZone(agent);
  };

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.kubernetes.operator.installOperatorsManually')}>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.kubernetes.operator.theLatestOperatorWillBeInstalled')}
            </Typography>
            <Code code={CODE_1} lang="bash" />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t(
            'in-plg:agentDetails.kubernetes.operator.enterAClusterNameAndOptionallyTheAgentZoneThatYouWantTheClusterToBePartOf'
          )}
        >
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.common.clusterName')}
              value={<FormInputPlg value={clusterName} onChange={value => setClusterName(value)} maxLength={65} />}
              withGap
            />
            <AgentzoneLister callBackFunc={updateAgentZone} />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.kubernetes.operator.configureTheCustomResourceYAMLFile')}>
          <Stack>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-plg:agentDetails.kubernetes.operator.followTheInstructionsInTheDocumentation"
                components={{
                  documentation: (
                    <a href="https://ibm.biz/install-agent-k8-manual" rel="noopener noreferrer" target="_blank" />
                  )
                }}
              />
            </Typography>
            <Code
              code={CODE_2({
                agentZone: agentZone,
                clusterName: clusterName,
                downloadKey: downloadKey
              })}
              lang="bash"
              withExpandButton
              linesToShow={15}
            />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.kubernetes.operator.runTheFollowingCommandToDeployTheInstanaAgent')}
        >
          <Code code={CODE_3} lang="bash" />
        </LayoutSection>

        <GetDeployedAgents agent="kubernetes" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default KubernetesOperator;
