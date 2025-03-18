/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { KeyValue, Stack, Typography, RadioButton } from '@instana/components';

import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import GetDeployedAgents from 'in-plg/components/GetDeployedAgents/GetDeployedAgents';
import SupportViewSection from 'in-plg/pages/onboarding/Layout/SupportViewSection';
import OnboardingProps from 'in-plg/pages/onboarding/content/OnboardingProps';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import DocumentLink from 'in-plg/components/DocumentLink/DocumentLink';
import Code from 'in-plg/components/Code/Code';
import { t } from 'in-i18n';

const agentModeOptions = ['dynamic', 'static'];

interface PackagingProps {
  agentMode: string;
  setAgentMode: React.Dispatch<React.SetStateAction<string>>;
}

function Packaging({ agentMode, setAgentMode }: PackagingProps) {
  return (
    <Stack direction="horizontal">
      <RadioButton
        label={t('in-plg:agentDetails.zos.dynamic')}
        checked={agentMode === agentModeOptions[0]}
        onChange={() => setAgentMode(agentModeOptions[0])}
        size="default"
      />
      <RadioButton
        label={t('in-plg:agentDetails.zos.static')}
        checked={agentMode === agentModeOptions[1]}
        onChange={() => setAgentMode(agentModeOptions[1])}
        size="default"
      />
    </Stack>
  );
}

export default function ZOS({
  agentKey,
  downloadKey,
  agentEndpoint,
  agentEndpointPort,
  instanaDomain,
  fromOnboarding
}: OnboardingProps) {
  const [agentMode, setAgentMode] = useState(agentModeOptions[0]);

  const sideCardData = [
    {
      title: t('in-plg:agentDetails.common.documentationTitle'),
      body: (
        <Stack>
          <DocumentLink
            text={t('in-plg:agentDetails.zos.installagentOnZOS')}
            href="https://ibm.biz/Tracing_WAS-Liberty_on_z-OS"
          />
          <DocumentLink
            text={t('in-plg:agentDetails.zos.installagentOnZOS1')}
            href="https://ibm.biz/Tracing_WAS-Liberty_on_z-OS"
          />
        </Stack>
      ),
      openByDefault: true
    }
  ];

  return (
    <Container>
      <MainBody>
        <Typography variant="body-regular">
          {t('in-plg:agentDetails.common.toInstallAndRunAnAgentCompleteTheFollowingSteps')}
        </Typography>

        <LayoutSection title={t('in-plg:agentDetails.zos.selectTheAgentPackagingMode')}>
          <Stack>
            <KeyValue
              label={t('in-plg:agentDetails.zos.Packaging')}
              value={Packaging({ agentMode, setAgentMode })}
              withGap
            />
          </Stack>
        </LayoutSection>

        <LayoutSection title={t('in-plg:agentDetails.zos.RunTheAgentDeploymentCode')}>
          <Code
            lang="bash"
            code={[
              `curl -o setup_agent.sh https://setup.instana.${instanaDomain}/agent && chmod 700 ./setup_agent.sh && chtag -R -tc 819 ./setup_agent.sh &&./setup_agent.sh -a ${agentKey} -d ${downloadKey} -t ${
                agentMode === 'dynamic' ? 'dynamic' : 'static'
              } -e ${agentEndpoint}:${agentEndpointPort} `
            ]}
          />
        </LayoutSection>
        <GetDeployedAgents agent="zos" fromOnboarding={fromOnboarding} />
      </MainBody>
      <SidePanel>
        <SupportViewSection items={sideCardData} />
      </SidePanel>
    </Container>
  );
}
