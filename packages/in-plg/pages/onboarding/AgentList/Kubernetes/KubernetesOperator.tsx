/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, SvgIcon, Typography } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import Tooltip from 'in-components/Tooltip/Tooltip';
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
  agentEndpointPort
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
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-kubernetes#installation-methods"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.networkRequirements')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host#network-requirements"
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
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-kubernetes#install-by-using-the-operator"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.kubernetes.operator.installAnAgentOnKubernetes')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-kubernetes"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.common.configuringTheAgentAfterInstall')}
            href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-configuring-host"
          />
        </>
      ),
      openByDefault: true
    },
    {
      title: t('in-plg:agentDetails.common.sideCard.askAColleagueForHelp'),
      body: <AskForHelp agentKey={downloadKey} />,
      openByDefault: false
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
      '    # See https://docs.instana.io/setup_and_manage/host_agent/on/kubernetes/'
    );
    return content;
  };

  const CODE_3 = ['kubectl apply -f instana-agent.customresource.yaml'];

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
              value={<FormInputPlg value={clusterName} onChange={value => setClusterName(value)} />}
              withGap
            />
            <KeyValue
              label={
                <Tooltip
                  content={
                    <Trans
                      i18nKey="in-plg:agentDetails.common.enterANameForAClusterGroupYouWantToAddThisClusterTo"
                      components={{ br: <br /> }}
                    />
                  }
                  align="auto"
                >
                  <Stack direction="horizontal" gap="xxsmall" align="center">
                    {t('in-plg:agentDetails.common.agentZoneOptional')}
                    <SvgIcon size="xs" type="lib_help_error_help_outline" color="var(--ids-color-option-neutral-600)" />
                  </Stack>
                </Tooltip>
              }
              value={<FormInputPlg value={agentZone} onChange={value => setAgentZone(value)} />}
              withGap
            />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.kubernetes.operator.configureTheCustomResourceYAMLFile')}>
          <Stack>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-plg:agentDetails.kubernetes.operator.followTheInstructionsInTheDocumentation"
                components={{
                  documentation: (
                    <a
                      href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-kubernetes#install-operator-manually"
                      rel="noopener noreferrer"
                      target="_blank"
                    />
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

        <GetDeployedAgents agent="kubernetes" />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
};

export default KubernetesOperator;
