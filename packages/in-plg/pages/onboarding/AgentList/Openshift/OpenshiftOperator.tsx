/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { KeyValue, Stack, SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  getDocumentations,
  getPrerequisites,
  getBashCode
} from 'in-plg/pages/onboarding/AgentList/Openshift/AgentDetailsOpenshiftContent';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import { FormInputPlg } from 'in-plg/pages/onboarding/content/ContentComponents';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import AskForHelp from 'in-plg/components/AskForHelp/AskForHelp';
import Code from 'in-plg/components/Code/Code';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';

export default function OpenshiftOperator({
  id,
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort
}: OnboardingProps): JSX.Element {
  const [clusterName, setClusterName] = useState<string>('');
  const [agentZone, setAgentZone] = useState<string>('');

  const codeApplyResourceYaml = ['kubectl apply -f instana-agent.customresource.yaml'];

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
    },
    {
      title: t('in-plg:agentDetails.askForHelp.askForHelpTitle'),
      body: <AskForHelp agentKey={agentKey} />,
      openByDefault: false
    }
  ];

  return (
    <Container>
      <MainBody>
        <LayoutSection title={t('in-plg:agentDetails.openshift.instructions.operator.installOperatorsManually')}>
          <Stack>
            <Typography variant="body-regular">
              {t('in-plg:agentDetails.openshift.instructions.operator.installOperatorsManuallySubtext')}
            </Typography>
            <Code
              code={[
                'kubectl apply -f https://github.com/instana/instana-agent-operator/releases/latest/download/instana-agent-operator.yaml'
              ]}
              lang="bash"
              withExpandButton={false}
            />
          </Stack>
        </LayoutSection>

        <LayoutSection
          title={t('in-plg:agentDetails.openshift.instructions.operator.enterAClusterNameAndOptionallyTheAgentZone')}
        >
          <Stack direction="horizontal">
            <KeyValue
              label={t('in-plg:agentDetails.common.clusterName')}
              value={<FormInputPlg onChange={value => setClusterName(value)} />}
              withGap
            />
            <KeyValue
              label={
                <Tooltip
                  content={
                    <Trans
                      i18nKey="in-plg:agentDetails.common.enterANameForAClusterGroupYouWantToAddThisClusterTo"
                      components={{ 1: <br /> }}
                    />
                  }
                  align="auto"
                >
                  <Stack direction="horizontal" gap="xxsmall" align="center">
                    {t('in-plg:agentDetails.common.agentZoneOptional')}
                    <SvgIcon
                      size="xs"
                      type="lib_help_error_help_outline"
                      color={themes.default.ids.color.option.neutral[600]}
                    />
                  </Stack>
                </Tooltip>
              }
              value={<FormInputPlg onChange={value => setAgentZone(value)} />}
              withGap
            />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.openshift.instructions.operator.configureCustomYamlFile')}>
          <Stack>
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-plg:agentDetails.openshift.instructions.operator.configureCustomYamlFileSubtext1"
                components={{
                  installOperatorDoc: (
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
              {...getBashCode({
                id: id,
                agentZone: agentZone,
                clusterName: clusterName,
                downloadKey: downloadKey,
                agentKey: agentKey,
                agentEndpoint: agentEndpoint,
                agentEndpointPort: agentEndpointPort
              })}
            />
            <Typography variant="body-regular">
              <Trans
                i18nKey="in-plg:agentDetails.openshift.instructions.operator.configureCustomYamlFileSubtext2"
                components={{
                  networkAccess: (
                    <a
                      href="https://www.ibm.com/docs/en/instana-observability/current?topic=agents-installing-host-agent-kubernetes#configure-network-access-for-monitored-applications"
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  )
                }}
              />
            </Typography>
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.openshift.instructions.operator.runTheFollowingCommand')}>
          <Code
            code={codeApplyResourceYaml}
            lang="bash"
            withoutCopyButton={false}
            withExpandButton={false}
            linesToShow={2}
          />
        </LayoutSection>

        <GetDeployedAgents agent="openshift" />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
